# Frontend Project Structure

## Folder Map

- src/app/ — app shell, providers, layout wrappers
- src/router/ — route definitions
- src/pages/ — page-level screens
- src/components/ — shared UI components
- src/features/ — domain features (auth, courses, sections, profile)
- src/store/ — Zustand slices and store setup
- src/services/ — API clients and data fetching helpers
- src/hooks/ — shared React hooks
- src/utils/ — helpers and utilities
- src/assets/ — static assets

## Notes
- Keep page components minimal; move logic into feature modules and hooks.
- Use `components/` for reusable UI elements and layout primitives.
- Use `features/` to group domain-specific UI, hooks, and store slices.
