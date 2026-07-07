# Copilot Review Instructions

You are reviewing pull requests for a basketball statistics reference site — a clone of basketball-reference.com — built as a portfolio project when applying to Sports Reference.

- React Router v8 (framework mode, SSR) + Node + TypeScript + Tailwind CSS + Prisma + PostgreSQL
- Deployed to Fly.io. Production DB on Supabase.

## What to prioritize

- **Correctness**: Data shape mismatches between Prisma queries and what route loaders return, especially given the Franchise→Team→TeamSeason→Game hierarchy.
- **Type safety**: Route loaders should use generated `Route.LoaderArgs` / `Route.ComponentProps` types, not `any`.
- **Naming**: files and folders in kebab-case; React components in PascalCase files; Prisma models in PascalCase singular.
- **Data access**: Raw Prisma queries belong in `src/access/app-db/`, never inline in route files.

## What to skip

- Style nits not backed by a rule in CLAUDE.md.
- Test coverage — no test suite exists yet; do not flag its absence.
- Accessibility — defer until UI is more stable.

## Review style

- Reference exact file and line numbers.
- When suggesting a fix, show the corrected code, not just a description.
- Flag issues that affect correctness or production safety first; cosmetic suggestions last.
