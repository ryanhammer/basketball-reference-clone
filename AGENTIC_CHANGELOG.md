# Agentic Development Changelog

This file tracks work done on this repository using Claude Code (claude.ai/code). It serves as a record of how agentic development was used to pick up a dormant project and move it toward MVP.

The repository was originally built in early 2024 as a portfolio project when applying to Sports Reference. It went dormant after that application cycle. Work resumed in July 2026 using Claude Code to modernize the stack and continue feature development.

---

## 2026-07-06

### Repository setup for agentic development

**Prompt intent:** Prepare the dormant repository for resumed development using Claude Code as the primary development tool.

**Work done:**
- Created `CLAUDE.md` with project overview, commands, architecture description, data model relationships, and deployment notes — gives future agent sessions immediate project context without re-exploration.
- Created this `AGENTIC_CHANGELOG.md` to track agentic contributions over time.

**Next:** Migrate from Remix v2 (`@remix-run/*`) to React Router v7 framework mode, then v8.

---

## 2026-07-06 (continued)

### Migrate Remix v2 → React Router v7 framework mode

**Prompt intent:** Upgrade the framework from the legacy `@remix-run/*` packages to React Router v7 framework mode as a stepping stone to v8.

**Work done:**
- Replaced `@remix-run/css-bundle`, `@remix-run/node`, `@remix-run/react`, `@remix-run/serve`, `@remix-run/dev` with `react-router`, `@react-router/node`, `@react-router/serve`, `@react-router/dev`
- Updated `package.json` scripts: `remix vite:dev` → `react-router dev`, `remix vite:build` → `react-router build`, `remix-serve` → `react-router-serve`
- Created `react-router.config.ts` (replaces inline plugin options; sets `appDirectory: 'src/web'`)
- Rewrote `vite.config.ts`: `remix()` plugin → `reactRouter()`, removed `installGlobals()`
- Updated `env.d.ts`: `@remix-run/node` reference → `@react-router/node`
- Updated `entry.client.tsx`: `RemixBrowser` → `HydratedRouter` from `react-router/dom`
- Updated `entry.server.tsx`: `RemixServer` → `ServerRouter`, imports from `react-router` and `@react-router/node`; removed `abortDelay` prop (not accepted by `ServerRouter`)
- Updated `root.tsx`: removed `@remix-run/css-bundle` (no longer needed), updated imports to `react-router`
- Updated all component/route imports: `@remix-run/react` → `react-router`, `@remix-run/node` → `react-router`
- Updated `tsconfig.json` to include `.react-router/types/**/*` for generated route types
- Confirmed clean `npm run typecheck`

**Next:** Upgrade react-router v7 → v8.

---

## 2026-07-06 (continued)

### Upgrade react-router v7 → v8

**Prompt intent:** Complete the framework migration by upgrading to react-router v8.1.0.

**Work done:**
- Bumped `react-router`, `@react-router/dev`, `@react-router/node`, `@react-router/serve` to `^8.1.0`
- Removed `future.v8_*` flags from `react-router.config.ts` — all are now default behavior in v8 and the `FutureConfig` type no longer accepts them
- Removed `AppLoadContext` import from `entry.server.tsx` — no longer exported from `react-router` in v8; typed unused `loadContext` parameter as `unknown`
- Confirmed clean `npm run typecheck`

**Notable:** npm's `latest` tag correctly pointed to 8.1.0 but failed to upgrade from 7.x with a `"latest"` specifier — required explicit `"^8.1.0"` pins to force resolution.

**Next:** Feature work — dynamic routing for league standings and season pages.

---

## 2026-07-06 (continued)

### Convert npm/Node to Bun

**Prompt intent:** Switch the package manager and runtime from npm/Node to Bun to simplify the toolchain before adding new features.

**Work done:**
- Replaced `npm` scripts with `bun run *` and `bunx *` throughout `package.json`
- Removed packages Bun makes redundant: `dotenv` (Bun loads `.env` natively), `tsx`, `ts-node`, `binode` (Bun runs TypeScript directly)
- Updated `prisma db seed` script to `bun --env-file .env src/prisma/seed.ts`
- Rewrote `Dockerfile` to use `oven/bun:1-slim` base image with multi-stage build (`deps`, `production-deps`, `build`, final)
- Added `"engines": { "bun": ">=1.0.0" }` to `package.json`
- Updated `tsconfig.json` types from `@types/node` to `bun-types`

**Notable:** Bun 1.2+ uses `bun.lock` (text format) rather than the old `bun.lockb` (binary). A Dockerfile bug introduced `bun.lockb` in the `production-deps` stage — caught and fixed later.

**Next:** Add agentic tooling infrastructure (skills, commands, CI workflows).

---

## 2026-07-06–07

### Add agentic tooling infrastructure

**Prompt intent:** Set up the repository so that future Claude Code sessions (and other AI agents) can work faster with less re-exploration — skills, reusable commands, context documents, and automated PR workflows.

**Work done:**
- Added `agent-skills/coding-preferences.md` — naming conventions, comment policy, abstraction rules, model selection guide (Sonnet 4.6 vs Fable 5)
- Added `agent-skills/data-access.md` — data layer pattern, loader rules, data model quick reference
- Added `docs/data-model.md` — full explanation of Franchise→Team→TeamSeason hierarchy, season types, stat granularity table, common query patterns
- Added `.claude/commands/fix-pr-feedback.md` — `/fix-pr-feedback <pr>` slash command: fetches inline review comments via `gh api` and addresses each actionable one
- Vendored React Router framework mode agent skill into `.claude/skills/react-router-framework-mode/` (source: `remix-run/agent-skills` GitHub repo); added `skills-lock.json` to track provenance
- Created `.github/copilot-instructions.md` with project-specific review priorities (data shape correctness, type safety) and explicit skip list (test coverage, a11y)
- Created `.github/workflows/claude-auto-fix-review.yml` — triggers on PRs to `main`/`staging`; polls for Copilot review of the HEAD SHA, then runs Claude Code to address feedback; loop guard prevents re-triggering on automated commits
- Created `.github/workflows/claude.yml` — handles `@claude` mentions in issues/PRs
- Updated `CLAUDE.md` with Agent Skills section pointing to all skill files and the `/fix-pr-feedback` command

**Next:** Restore 2024 game/player/team data to a working local Postgres instance.

---

## 2026-07-08–09

### Restore local database from 2024 backup

**Prompt intent:** Get the app's Postgres data (NBA 2023-24 season: teams, players, games, stats) into a working local database so feature development can use real data.

**Work done:**
- Identified two backup files: a 2024 Supabase cluster dump (plain SQL, Supabase-specific roles made it incompatible with plain Postgres) and a cleaner `pg_dump -Fc` dump from the old development laptop (PG 16.1 custom format)
- Attempted `supabase db start --from-backup` with the CLI — restore script failed because `supabase_admin` role didn't exist at authentication time; abandoned this approach
- Pulled `postgres:16-alpine` Docker image to bridge the PG 16→15 version gap; restored the custom-format dump into a temporary PG 16 container
- Exported plain SQL via `pg_dump --no-owner --no-acl --schema=public` from the PG 16 container (plain SQL is version-agnostic)
- Updated `docker-compose.yml` to use `postgres:16-alpine` (already pulled; avoids re-download)
- Started the app's Docker postgres via `bun run docker`; imported the plain SQL dump via `docker exec psql`
- Confirmed all 16 tables populated: 273 games, 548 players, 5 898 player-game rows, etc.
- Set `DATABASE_URL` in `.env` to `postgresql://hammeredreferencedev:moarBballStats@localhost:5432/baketball-reference-clone` (note: `baketball` is a legacy typo present in all migrations and the existing DB — intentionally preserved for consistency)
- Verified `bunx prisma migrate status` — 17 migrations applied, schema up to date
- Removed `supabase/` directory created during failed restore attempt

**Next:** Feature development — league standings page, team season page, player page.

---

*Each entry in this log reflects a session or focused unit of work. Entries include the intent behind the prompt, what was actually changed, and any relevant context for the next session.*
