# Data Access Patterns

## Layer Structure

```
Route Loader  →  src/access/app-db/<model>.ts  →  Prisma (appDB)
   (thin)              (query functions)            (singleton)
```

Route loaders call functions from `src/access/app-db/`. They do not contain inline Prisma queries. No service layer exists yet — add one only if a loader grows beyond ~30 lines of data logic.

## Prisma Client

Singleton exported from `src/prisma/index.ts`:

```ts
import { appDB } from '../../prisma';
```

All `src/access/app-db/` files import from here. Route files never import `appDB` directly.

## Adding a Query Function

Add to the relevant file in `src/access/app-db/`. If one doesn't exist for the model, create it. Pattern:

```ts
// src/access/app-db/team-season.ts
import { Prisma, TeamSeason } from '@prisma/client';
import { appDB } from '../../prisma';

export async function getTeamSeasonsByLeagueAndYear(
  leagueAbbrev: string,
  year: number
): Promise<TeamSeason[]> {
  return appDB.teamSeason.findMany({
    where: {
      season: { league: { abbreviation: leagueAbbrev }, year },
    },
    include: { team: true },
    orderBy: { gamesWon: 'desc' },
  });
}
```

## Loader Pattern

```ts
// src/web/routes/leagues.$leagueAbbrev.$year.tsx
import type { Route } from '.react-router/types/src/web/routes/+types/leagues.$leagueAbbrev.$year';
import { getLeagueStandings } from '../../access/app-db/team-season';

export async function loader({ params }: Route.LoaderArgs) {
  const year = Number(params.year);
  const standings = await getLeagueStandings(params.leagueAbbrev, year);
  return { standings, leagueAbbrev: params.leagueAbbrev, year };
}
```

Loaders are thin: parse params, call one or two access functions, return. No business logic, no date math, no filtering.

## Key Data Model Relationships

See `docs/data-model.md` for the full explanation. Quick reference:

- `League` → `Season[]` (one league has many seasons, each typed by `SeasonType`: REG, PST, PRE, IST, PIT)
- `League` → `Franchise[]` → `Team[]` → `TeamSeason[]` (handles franchise renames/relocations)
- `TeamSeason` links a `Team` to a `Season` and carries all aggregate season stats
- `Game` references `homeTeam` and `awayTeam` as `TeamSeason` IDs, not `Team` IDs
- Per-game stats: `TeamGame` (team box score), `PlayerGame` (player box score)
- Season aggregates: `TeamSeason`, `PlayerSeason`

## Type Safety

Use the generated route types from `.react-router/types/`. See `.claude/skills/react-router-framework-mode/references/type-safety.md` for the full pattern.
