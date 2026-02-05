# Page/Route Map & Navigation

## Public Routes
- `/` — Landing page (highlights + login + sign up)
- `/login` — Login
- `/signup` — Sign up
- `/forgot-password` — Request reset
- `/reset-password` — Reset form (token)

## Authenticated Routes
- `/app` — Home (prompt input + sidebar: past courses, settings, help, profile)
- `/app/courses/:courseId` — Course page (description + section list)
- `/app/courses/:courseId/sections/:sectionId` — Section page
- `/app/profile` — Profile
- `/app/settings` — Settings
- `/app/help` — Help

## Navigation Structure
- **Primary (authenticated sidebar)**
  - Home
  - Past courses
  - Profile
- **Secondary**
  - Settings
  - Help

## Layout Strategy
- Public pages use a lightweight header/footer layout focused on highlights and auth entry points.
- Authenticated pages use `AppLayout` with:
  - Desktop sidebar (past courses, settings, help, profile)
  - Mobile drawer
  - Main content area for prompt input, course details, and section content

## Notes
- Public routes should not include the authenticated sidebar.
- Auth routes should be protected with a route guard using auth state from Zustand.
- Prompt submission should create a course, then redirect to `/app/courses/:courseId`.
