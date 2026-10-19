# Marketspace project progress

Last updated: 2026-10-19

## Current milestone: public marketplace foundation — complete

The app has a working Express/PostgreSQL foundation for public marketplace browsing. Authentication is the next major project phase. Logged-in features that require a trusted user identity are intentionally not called complete; finish them after authentication.

### Backend and data

- Express 5 server with ES modules, `node --watch`, environment configuration, CORS, JSON parsing, and static photo serving.
- PostgreSQL pool and six sample tables: users, categories, listings, listing photos, comments, and reviews.
- Listings API: create, list with search/category/price/sort/pagination, detail, update, delete, and photo upload.
- Listing POST/PATCH and query validation with Zod; numeric ID checks; consistent JSON 400/404 responses; JSON not-found and central unexpected-error handlers.
- Photo upload restrictions, UUID filenames, image-signature checks, listing-existence checks, database transaction, and cleanup on failure. Listing deletion removes associated local photo files after its database transaction.
- Detail/list/search responses include photo URLs, seller information where needed, and real review averages.
- Public APIs: categories, user profile read, global search, and health check.
- CORS and public photo origin are configurable through environment variables; `nodemon` removed.
- Six read-only/API integration tests run with Node's built-in test runner.

### Frontend and UI

- Reworked Marketspace visual design with an editorial-style homepage, custom generated hero art, refreshed listing cards, responsive navigation and layout, polished forms, accessible focus states, reduced-motion support, favicon, and page metadata.
- Listing browse/detail and profile reads use the Express API. Global search has its own results page for listings and people.
- Verified the frontend production build, public API behavior, and mobile viewport layout.

## Verification

- `backend`: `npm test` — 6 tests pass; these are integration tests and require the configured local PostgreSQL database and seeded sample data.
- `frontend`: `npm run build` — passes.
- Live checks: health, listing filters/detail, global search, user profile, validation errors, and JSON 404.
- Responsive check at 390px viewport: no horizontal overflow; browser console reported zero errors.

## Next major phase: authentication

1. Decide the account identity model and add unique email plus password-hash columns (never store plain-text passwords).
2. Registration and login with password hashing, safe validation, and clear error behavior.
3. Choose and implement cookie sessions (compare with JWT first, as part of the lesson).
4. Replace placeholder AuthContext identity with server-backed login/session state.
5. Add authentication middleware and authorization rules, starting with listing ownership; replace the hard-coded seller ID.
6. Test authenticated and unauthenticated access, ownership, logout, and session expiry.

## Features intentionally after authentication

These UI flows exist, but several still call the frontend placeholder/demo service or require a real authenticated user. Do not describe them as backed by Express yet:

- Cart, checkout, favorites, and orders.
- Service booking and booking management.
- Create/edit/delete comments and reviews.
- Follow/unfollow and notifications/messages.
- Registration/login and account-only pages.
- Admin operations and listing ownership restrictions.

Implement them resource by resource after identity and authorization are real. The public comments and reviews GET endpoints are implemented.

## Later production engineering lessons

- Database migrations, rate limiting/security headers, structured request logging, performance/index review, image processing/background jobs, Docker, deployment, monitoring, and broader automated coverage.
