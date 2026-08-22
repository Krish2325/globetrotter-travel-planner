# Globetrotter — Regression Checklist

Run this whenever a change touches authentication, authorization, or shared
middleware (`app.js`, `auth.middleware.js`, any controller). Automated items
run via `npm test` in `backend/`; manual items need a running dev server.

## Automated (run `npm test` in `backend/`)

- [ ] `tests/health.test.js` — server boots, 404 handler intact
- [ ] `tests/auth.test.js` — signup/login validation, password policy, no user-enumeration on login
- [ ] `tests/adminSignup.test.js` — admin signup still gated by `ADMIN_SIGNUP_SECRET`
- [ ] `tests/notes.test.js` — notes still scoped to the owning user (BUG-006)
- [ ] `tests/community.test.js` — share-trip still verifies trip ownership (BUG-007)
- [ ] `tests/trips.test.js` — trip CRUD ownership + `/admin/*` guard intact
- [ ] `tests/securityHeaders.test.js` — CSP/HSTS/referrer-policy/rate-limit headers still present
- [ ] `tests/knownIssues.idor.test.js` — still *failing* as expected (BUG-002..005). If one of these starts **passing**, the underlying controller was fixed — flip it from `test.failing` to `test` in the same change, and update its status in `bug-reports.md` to ✅ Fixed.

Expected result: all suites green (`Test Suites: 8 passed, 8 total`), including the known-issue suite (which reports green because its failures are the *expected* kind).

## Manual

- [ ] `POST /api/auth/admin-signup` with no `ADMIN_SIGNUP_SECRET` set → 503
- [ ] `POST /api/auth/admin-signup` with a wrong invite code → 403, no account created (check DB/admin console user list)
- [ ] Hammer `POST /api/auth/login` >20 times in 15 minutes from one IP → 429 after the limit
- [ ] Log in as two different users in two browser profiles; confirm neither can see the other's trips/notes/budgets by manually editing IDs in the URL or via devtools network requests
- [ ] Confirm `backend/.env` is never present in `git status` output and isn't tracked (`git ls-files backend/.env` returns nothing)
- [ ] Boot the backend with `JWT_SECRET` unset → process exits with the expected error message, does not silently start

## When adding a new authenticated resource (trip-scoped or otherwise)

Use this as a pre-merge gate for any new controller, informed by BUG-002
through BUG-005:

1. Does every read/update/delete look up the resource **scoped to
   `req.user.id`** (directly, or via its parent trip), not just by raw `:id`?
2. Does `router.use(authenticate)` actually run before the handler (check
   route file, not just controller assumptions)?
3. Do admin-only actions also require `requireAdmin`, not just `authenticate`?
4. Does any `update` handler restrict which fields it writes from
   `req.body`, rather than spreading the whole body into Prisma `data`?
5. Is there a test in `backend/tests/` covering the cross-user-403/404 case?
