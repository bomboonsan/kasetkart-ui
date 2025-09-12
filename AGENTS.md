# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages, layouts, and routes.
- `components/`: Reusable UI components (prefer PascalCase files).
- `lib/`: Client/server utilities (API, helpers); `utils/` for small shared helpers.
- `public/`: Static assets served at `/`.
- `middleware.js`: Auth/edge middleware.
- `docs/`: Project notes (see Strapi v5 mapping guide).
- Config: `next.config.mjs`, `eslint.config.mjs`, `postcss.config.mjs`, `tailwind.config.js`.

## Build, Test, and Development Commands
- `pnpm dev`: Run local dev server on `http://localhost:3000` (Turbopack).
- `pnpm build`: Production build (`.next/` output; standalone enabled).
- `pnpm start`: Start built app.
- `pnpm lint`: Lint with Next.js ESLint config.
- Docker (optional): `docker build -t kasetkart-ui .` then `docker run -p 3000:3000 kasetkart-ui`.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; use Prettier defaults if configured by your editor.
- Language: JS/TS supported; prefer `.tsx` for React components.
- Components: PascalCase filenames (e.g., `UserCard.tsx`); hooks `useThing.ts`.
- Helpers: camelCase exports in `lib/` and `utils/`.
- Styling: Tailwind CSS v4 + DaisyUI; keep class lists readable and grouped by role.
- Linting: fix issues before commit (`pnpm lint`).

## Testing Guidelines
- No test runner is configured yet. If adding tests, prefer Jest or Vitest with React Testing Library.
- Place tests near sources or under `__tests__/`; name `*.test.ts(x)`.
- Aim for critical-path coverage (auth flow, data fetching, forms) and avoid brittle DOM snapshots.

## Commit & Pull Request Guidelines
- Commits: clear, imperative subject (e.g., "Add profile form validation"); group related changes.
- Recommended format: `type(scope): summary` (feat, fix, chore, docs, refactor).
- PRs: include description, linked issues, steps to test, and screenshots for UI changes.
- Keep PRs small and focused; note any breaking changes.

## Security & Configuration Tips
- Env: store secrets in `.env.local`; avoid committing `.env*` with secrets.
- Backend: API targets are defined in env and `next.config.mjs` image patterns; update carefully when endpoints change.
