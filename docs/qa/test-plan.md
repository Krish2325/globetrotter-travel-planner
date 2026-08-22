# Globetrotter — QA Test Plan

**Branch:** `krish`
**Owner:** QA (Krish Suthar)
**Application under test:** Globetrotter Travel Planner — Node/Express + Prisma (SQLite) backend, React/Vite frontend, standalone admin console (React/Vite).

## 1. Scope

| In scope | Out of scope |
|---|---|
| Backend REST API (`/api/*`) — auth, trips, stops, activities, budgets, expenses, checklists, notes, community sharing, cities, users, analytics, public discovery | Third-party services: SMTP delivery, OpenStreetMap tile rendering, Unsplash image hosting |
| Frontend user app (login/signup, dashboard, trip builder, itinerary, budget, checklist, notes, city/activity search, community) | Load/performance testing at scale (not part of this pass) |
| Admin console (embedded `frontend/src/admin` + standalone `admin/`) | Payment flows (none exist in this app) |
| Cross-user data isolation / authorization boundaries | Native mobile apps (none exist) |

## 2. Test approach

- **Automated backend tests** — Jest + Supertest against the Express app, with the Prisma client mocked (`backend/tests/helpers/prismaMock.js`) so tests are fast, deterministic, and don't require a live database. Run with `npm test` inside `backend/`.
- **Manual functional tests** — frontend user flows, exercised through the browser against a running dev server (`npm run dev` in `frontend/` and `backend/`). Tracked in [`manual-test-cases.md`](./manual-test-cases.md).
- **Security/authorization testing** — targeted review of every controller for missing ownership checks (IDOR), input validation, and privilege boundaries, following the pattern used to find and confirm the notes/community bugs. Findings tracked in [`bug-reports.md`](./bug-reports.md).
- **Regression testing** — a fixed checklist re-run after any change touching auth, authorization, or shared middleware. See [`regression-checklist.md`](./regression-checklist.md).

## 3. Test environments

| Env | Backend | Frontend | Notes |
|---|---|---|---|
| Local dev | `http://127.0.0.1:5000` (SQLite `dev.db`) | `http://localhost:5173` (Vite) | Requires `backend/.env` from `.env.example`; `JWT_SECRET` and `ADMIN_SIGNUP_SECRET` must be set or the server refuses to boot / admin signup is disabled |
| Test (automated) | In-process `supertest`, Prisma mocked | n/a | `backend/tests/setup.js` sets test env vars automatically |

## 4. Feature areas & test focus

1. **Auth** — signup/login validation, password policy, duplicate-email handling, admin invite-code gate, token issuance and expiry, `/auth/me` session bootstrap.
2. **Trips** — CRUD, ownership scoping, status transitions, admin catalog management (`/admin/*` routes) vs. user-owned trips.
3. **Itinerary (stops & activities)** — adding/reordering stops, attaching activities, city/activity search and filters.
4. **Budget & expenses** — creating a budget, category breakdown, expense CRUD, currency handling.
5. **Checklists** — packing list CRUD, item toggling.
6. **Notes** — CRUD, cross-user isolation (regression-tested, see BUG-006).
7. **Community** — publishing a trip, browsing public shares, copying a shared trip, deleting your own share.
8. **Admin console** — analytics dashboards, user/trip/city/activity management, all gated behind `role === 'ADMIN'`.

## 5. Entry / exit criteria

**Entry:** feature branch builds, `npm install` succeeds in `backend/` and `frontend/`, `backend/.env` configured from `.env.example`.

**Exit for this pass:**
- All automated tests in `backend/tests/` pass (`npm test`), except the deliberately-marked `test.failing` known-issue tests in `knownIssues.idor.test.js`.
- All manual test cases in `manual-test-cases.md` executed at least once with recorded Pass/Fail.
- Every open item in `bug-reports.md` has a severity and owner.

## 6. Known limitations of this pass

- No automated frontend (component/E2E) tests were added — the sandbox's Node.js version (18.x) predates the frontend toolchain's minimum (Vite 8 / ESLint 10 require Node 20+), so frontend automation couldn't be executed and verified in this environment. Manual test cases cover the frontend instead; see `manual-test-cases.md`.
- Backend tests use a mocked Prisma client rather than a live SQLite database, so they verify controller/route logic (validation, auth, ownership) but not actual SQL/migration behavior.
