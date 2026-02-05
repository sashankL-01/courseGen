# Responsive Breakpoints & Layout Rules

## Breakpoints (Mobile-First)
Use Tailwind defaults:
- **xs**: 0–639 (base)
- **sm**: ≥ 640
- **md**: ≥ 768
- **lg**: ≥ 1024
- **xl**: ≥ 1280
- **2xl**: ≥ 1536

## Layout Rules
- Default layout targets **mobile**; add `sm:`, `md:`, `lg:` overrides progressively.
- Max container width:
  - App shell: `max-w-7xl` with `px-4`
  - Marketing pages: `max-w-6xl` with `px-4`
- Grids:
  - Use 1 column by default, `sm:grid-cols-2`, `lg:grid-cols-3` where needed.
- Sidebar:
  - `md:` and up uses **fixed sidebar**.
  - `sm` and below uses **drawer** with overlay.
- Typography:
  - Headings scale at `sm` and `lg` only (avoid too many steps).
- Spacing:
  - Use `gap-3`/`gap-4` on mobile, `gap-6`/`gap-8` on `lg`.
- Cards:
  - Full width on mobile, multi-column only at `md` and up.
- Forms:
  - Stacked inputs on mobile; allow inline actions from `md`.

## Usage Examples
- `grid gap-4 md:grid-cols-2 xl:grid-cols-3`
- `flex flex-col gap-3 md:flex-row md:items-center`
- `hidden md:flex` (desktop-only)
- `md:hidden` (mobile-only)
