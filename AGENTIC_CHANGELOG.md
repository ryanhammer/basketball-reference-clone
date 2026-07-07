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

*Each entry in this log reflects a session or focused unit of work. Entries include the intent behind the prompt, what was actually changed, and any relevant context for the next session.*
