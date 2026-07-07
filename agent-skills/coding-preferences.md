# Coding Preferences

## General Rules

- **No speculative abstractions** — three similar lines is better than a premature helper. Only abstract when a third real use case exists.
- **No feature flags or backwards-compat shims** — just change the code.
- **No error handling for impossible cases** — trust Prisma, trust React Router, trust TypeScript. Only validate at system boundaries (user input, external APIs).
- **No trailing summaries** — don't explain what you just did at the end of a response.

## Comments

Default to **no comments**. Add one only when the WHY is non-obvious: a hidden constraint, a workaround for a specific bug, a subtle invariant. Never describe what the code does.

## TypeScript

- Prefer `type` over `interface` for object shapes
- Use React Router's generated `Route.LoaderArgs` / `Route.ComponentProps` — never `any` for route types
- Discriminated unions over optional fields where intent differs

## Naming

| Thing | Convention | Example |
|---|---|---|
| Files/folders | kebab-case | `team-season.ts` |
| React components | PascalCase files | `StandingsTable.tsx` |
| TS types | PascalCase | `TeamStanding` |
| Variables/functions | camelCase | `getLeagueStandings` |
| DB models (Prisma) | PascalCase singular | `TeamSeason` |
| Route segments | kebab-case | `/leagues/nba/2024` |
| Branch names | `feature/`, `bugfix/`, `chore/` prefix | `feature/league-standings` |

## File Organization

- Co-locate sub-components in the route file if only used there
- Extract to `src/web/components/` when a component is reused or grows beyond ~100 lines
- Keep route files under ~150 lines — move query logic to `src/access/app-db/`

## Formatting

- **Biome** handles formatting — run `bun run format`. Do not use Prettier.

## Model Selection

| Model | Use for |
|---|---|
| Sonnet 4.6 | Most tasks — components, loaders, queries, debugging |
| Fable 5 | Full route end-to-end (DB → loader → component), complex multi-file reasoning |
