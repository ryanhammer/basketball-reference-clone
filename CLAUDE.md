# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Agent Skills

**Official React Router skill** (load for any route/loader/action/form work):
`.claude/skills/react-router-framework-mode/SKILL.md`

**Project-specific skills** (load based on task):

| File | Load when… |
|---|---|
| `agent-skills/data-access.md` | Writing loaders, Prisma queries, or adding access functions |
| `agent-skills/coding-preferences.md` | Any code generation — naming, comments, abstractions, TypeScript |

**Data model reference:** `docs/data-model.md` — read before writing any query that spans Season, TeamSeason, or Game.

**PR feedback:** `/fix-pr-feedback <pr-number>` — fetches inline review comments and addresses each actionable one.

## Project Overview

A clone of [Basketball Reference](https://www.basketball-reference.com/) built with React Router (framework mode), Prisma, PostgreSQL, and Tailwind CSS. Deployed to Fly.io. Data is sourced from the Sportradar API and stored locally in Postgres.

## Commands

```bash
# Local dev
npm run docker                        # Start Postgres via Docker Compose
npm run setup                         # prisma generate + migrate deploy + seed (first-time or after pulls)
npm run dev                           # Start dev server on port 3000

# Database
npm run dev:db:seed                   # Reset DB and re-seed from scratch
npm run dev:db:reset                  # Reset DB, skip seed
npm run dev:db:apply-new-migrations   # Run new migrations in dev (generates migration file)

# Data ingestion
npm run script:update-db-from-game-summary  # Ingest game summary data from Sportradar

# Quality
npm run format    # Biome formatter (not Prettier)
npm run lint      # ESLint
npm run typecheck # tsc --noEmit
npm run build     # Production build
```

Required env vars (see `.env.example`): `DATABASE_URL`, `FLY_API_TOKEN`.

## Architecture

### Directory layout

```
src/
  access/
    app-db/       # Prisma query functions, one file per model (e.g. game.ts, player.ts)
    sportradar/   # Sportradar API access functions
  prisma/
    schema.prisma # Single source of truth for the data model
    migrations/   # Prisma migration history
    seed.ts       # DB seed script
    index.ts      # Exports `appDB` (the PrismaClient singleton)
  scripts/        # One-off data ingestion scripts (run with tsx)
  types/          # External API response types (Sportradar)
  utils/          # Shared helpers (model utilities, Sportradar data transformers)
  web/
    routes/       # React Router file-based routes
    components/   # UI components (not co-located with routes)
    root.tsx      # App shell (html/head/body, Header, Outlet)
    entry.client.tsx / entry.server.tsx
    index.css     # Tailwind entry
```

### Data model key relationships

The schema uses a **Franchise → Team → TeamSeason** hierarchy to handle franchise renames and relocations across seasons. A `Season` is scoped to a `League` and has a `SeasonType` enum (REG, PST, PRE, IST, PIT). Game-level stats exist at three granularities: `Game` (box score totals), `TeamGame` (per-team per-game), and `PlayerGame` (per-player per-game). Season aggregates live on `TeamSeason` and `PlayerSeason`.

### Data layer pattern

`src/access/app-db/` files are thin wrappers around `appDB` (the Prisma client from `src/prisma/index.ts`). They are the only place raw Prisma calls should appear — routes and scripts import from here, not directly from `@prisma/client`.

### Tooling notes

- **Formatter**: Biome (`npm run format`), not Prettier. Config in `biome.json`.
- **No test suite yet** — this is a known gap.
- **Prisma schema location** is non-default: `src/prisma/schema.prisma` (configured in `package.json` under `"prisma"`).
- `appDirectory` for React Router is `src/web` (non-default, set in `react-router.config.ts`).

## Deployment

Fly.io (`fly.toml`). Two environments: `staging` branch → staging app, `main` branch → production. The Dockerfile handles `prisma generate` at build time. Production DB is hosted on Supabase.
