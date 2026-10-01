# Marketspace — frontend (placeholder UI for the Express.js learning project)

This is a React (Vite) frontend built as **the target consumer** for an
Express.js + PostgreSQL backend you are building by hand, one concept at a
time. There is intentionally **no backend here** — no `server/` folder, no
backend `package.json`. You build that yourself as you learn each topic,
the same way the raw-Node Animal Shelter API was built against the
`animal-shelter-frontend` project.

## Why this domain

Marketspace mixes three domains on purpose — a product marketplace, a
bookable-services layer, and a light social layer (profiles, follows,
reviews, comments, messaging) — plus an admin panel. That mix is what
forces coverage of nearly every topic in the Express/PostgreSQL curriculum
inside ONE coherent app, instead of a dozen disconnected toy examples:

- **Auth**: register / login / logout / forgot-password / reset-password / "who am I"
- **Authorization**: buyer / seller / admin roles gating both UI and (eventually) routes
- **CRUD with real relationships**: users, listings, categories, reviews, comments — one-to-many and many-to-many (favorites, follows)
- **Nested resources**: `/listings/:id/reviews`, `/listings/:id/comments`, `/listings/:id/availability`
- **File uploads**: avatar, cover photo, multiple listing photos
- **Search, filter, sort, pagination**: the listings feed and every admin table
- **Transactions & concurrency**: checkout (stock decrement) and booking a time slot — both are classic "two requests race for the same row" problems
- **Idempotency**: checkout must not double-charge on a retried request
- **Background-job-shaped features**: notifications, "email" sending (forgot-password) — good candidates for a queue later
- **Admin/observability angle**: platform stats, moderation, banning

## Folder structure

```
src/
  api/          one file per resource, each function documents the exact
                Express route it expects (method, URL, body/response shape)
  components/
    common/     generic, reusable UI (spinners, errors, pagination, uploader, route guards)
    layout/     navbar, footer, sidebar
    listings/   listing-specific UI (card, grid, filters, search bar)
  context/      AuthContext — single source of truth for the logged-in user
  hooks/        useAuth, usePagination, useDebounce
  pages/        one folder per feature area, matching the routes in App.jsx
  utils/        constants and formatters shared across pages
```

## Running it

```
npm install
npm run dev
```

It will run and render, but every page that calls an `api/*.js` function
will show an error state until the matching Express route exists — that's
expected. As you build each backend route, refresh the matching page and
watch it come alive with zero frontend changes needed, as long as the
response shape matches the comment above that api function.

## Everything here is a placeholder

The styling is intentionally bare — replace `src/index.css` and the inline
styles with whatever you like once the functionality works. Nothing in
`api/`, `pages/`, or `components/` should be treated as "the right way" to
design these screens; change anything.
