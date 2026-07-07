# Data Model

## Core Design Decisions

### Franchise vs. Team vs. TeamSeason

The schema separates **Franchise**, **Team**, and **TeamSeason** to handle the full history of the NBA:

- A **Franchise** is the organizational entity (e.g. "Lakers"). It persists across relocations and renames.
- A **Team** is a specific name/abbreviation for a franchise in a given era (e.g. "Minneapolis Lakers", "Los Angeles Lakers"). Each relocation or rename creates a new Team.
- A **TeamSeason** is a Team's participation in one specific Season. This is where per-season stats and records live.

```
Franchise (Lakers org)
  └── Team (Los Angeles Lakers, 1960–present)
        └── TeamSeason (LAL in 2023-24 Regular Season)
        └── TeamSeason (LAL in 2023-24 Postseason)
  └── Team (Minneapolis Lakers, 1947–1960)
        └── TeamSeason (MLS in 1959-60 Regular Season)
        └── ...
```

**Implication**: When querying game participants, `Game.homeTeamId` and `Game.awayTeamId` reference `TeamSeason` IDs, not `Team` IDs. Always join through `TeamSeason` to get team metadata.

### Season Types

A `Season` has a `SeasonType` enum:

| Value | Meaning |
|---|---|
| `REG` | Regular season |
| `PST` | Postseason / playoffs |
| `PRE` | Preseason |
| `IST` | In-Season Tournament (non-regular games) |
| `PIT` | Play-In Tournament |

Each Season type is a separate `Season` row. A full NBA year has multiple Season records for the same `year` integer.

### Stat Granularity

Stats exist at three levels:

| Model | Scope | Use for |
|---|---|---|
| `TeamSeason` | Season aggregate for a team | Standings, season totals |
| `PlayerSeason` | Season aggregate for a player | Player stats tables |
| `TeamGame` | Per-game stats for a team | Box score team row |
| `PlayerGame` | Per-game stats for a player | Box score player row |
| `Game` | Metadata + quarter scores | Scoreboard, game header |

### Player Stats on `PlayerSeason`

A player can appear on multiple `PlayerSeason` rows in the same year (e.g. traded mid-season). Each `PlayerSeason` is scoped to a `TeamSeason`, and `isTwoWayContract` flags two-way players.

## Common Query Patterns

### League standings for a season

```
Season (year=2024, type=REG, league=NBA)
  └── TeamSeason[] (all teams in that season)
        └── Team → for name/abbreviation
        └── Venue → for home city
```

Order `TeamSeason` by `gamesWon DESC`, compute win% client-side.

### Team season page

```
TeamSeason (team=LAL, season=2024 REG)
  └── PlayerSeason[] → Player (for roster)
  └── Game[] (via homeGames + awayGames relations) → for schedule/results
```

### Game box score

```
Game
  └── homeTeam (TeamSeason) → Team
  └── awayTeam (TeamSeason) → Team
  └── TeamGame[] (one per team)
  └── PlayerGame[] → PlayerSeason → Player
```

## External IDs

Most models have an `externalId` field for the Sportradar API ID. Used during data ingestion via `src/scripts/update-db-from-game-summary.ts`. Not used by the web layer.
