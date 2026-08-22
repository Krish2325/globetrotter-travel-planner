# Globetrotter — Bug Reports

Found during a security-focused code review of every backend controller and
route (branch `krish`). Severity uses: **Critical** (unauthorized data
access/takeover), **High** (privilege escalation / data integrity),
**Medium** (defense-in-depth / hardening), **Low** (best-practice gap).

---

### BUG-001 — Anyone could self-register an ADMIN account
- **Component:** `backend/src/controllers/auth.controller.js` → `adminSignup`, `POST /api/auth/admin-signup`
- **Severity:** Critical
- **Status:** ✅ Fixed
- **Steps to reproduce (pre-fix):** `POST /api/auth/admin-signup` with any `name`/`email`/`password` — no authentication or authorization required.
- **Expected result:** Only an authorized operator can create ADMIN accounts.
- **Actual result (pre-fix):** A 201 with a valid JWT and `role: "ADMIN"`, granting full access to `/admin/*` API routes (user management, trip catalog, analytics) and the admin console.
- **Fix:** Requires an `inviteCode` matching `process.env.ADMIN_SIGNUP_SECRET`; the endpoint returns 503 (disabled) if that env var isn't set at all, 403 on a wrong/missing code. Frontend `AdminSignup.jsx` now collects the invite code.
- **Verification:** `backend/tests/adminSignup.test.js` (4 tests).

---

### BUG-002 — Budget API has no ownership check (IDOR)
- **Component:** `backend/src/controllers/budget.controller.js` (`getBudget`, `updateBudget`, `deleteBudget`)
- **Severity:** High
- **Status:** 🔴 Open
- **Steps to reproduce:** As User A, call `GET /api/budgets/<User B's tripId>` with a valid User A token.
- **Expected result:** 404 — the trip isn't User A's.
- **Actual result:** 200 with User B's full budget breakdown (total, per-category spend). `updateBudget`/`deleteBudget` are equally unscoped — User A can silently edit or delete User B's budget.
- **Suggested fix:** Same pattern used on `note.controller.js` — look up the parent `Trip` scoped to `req.user.id` first, 404 if it doesn't resolve, before touching the `Budget` row.
- **Regression test (encodes the fix target, currently expected-failing):** `backend/tests/knownIssues.idor.test.js` → `BUG-002`.

---

### BUG-003 — Checklist item API has no ownership check (IDOR)
- **Component:** `backend/src/controllers/checklist.controller.js` (`addItem`, `updateItem`, `deleteItem`, `deleteChecklist`)
- **Severity:** High
- **Status:** 🔴 Open
- **Steps to reproduce:** As User A, call `PATCH /api/checklists/items/<User B's itemId>` with `{ "label": "tampered" }`.
- **Expected result:** 403/404 — the item's checklist doesn't belong to User A.
- **Actual result:** 200 — the item is updated regardless of who owns the parent checklist/trip. Same for `deleteItem`/`deleteChecklist`.
- **Suggested fix:** Verify `checklistItem.checklist.trip.userId === req.user.id` (via an `include`/nested `findFirst`) before mutating.
- **Regression test:** `backend/tests/knownIssues.idor.test.js` → `BUG-003`.

---

### BUG-004 — Expense API has no ownership check (IDOR)
- **Component:** `backend/src/controllers/expense.controller.js` (`updateExpense`, `deleteExpense`)
- **Severity:** High
- **Status:** 🔴 Open
- **Steps to reproduce:** As User A, call `DELETE /api/expenses/<User B's expenseId>`.
- **Expected result:** 403/404.
- **Actual result:** 200 — the expense is deleted with no check that its trip belongs to User A.
- **Suggested fix:** Same pattern as BUG-002 — resolve the parent trip scoped to `req.user.id` first.
- **Regression test:** `backend/tests/knownIssues.idor.test.js` → `BUG-004`.

---

### BUG-005 — Stop (itinerary) API has no ownership check (IDOR)
- **Component:** `backend/src/controllers/stop.controller.js` (`updateStop`, `deleteStop`, `addActivityToStop`, `removeActivityFromStop`)
- **Severity:** High
- **Status:** 🔴 Open
- **Steps to reproduce:** As User A, call `PATCH /api/stops/<User B's stopId>` with new `notes`.
- **Expected result:** 403/404.
- **Actual result:** 200 — any authenticated user can rewrite/delete another user's itinerary stops and detach their planned activities.
- **Suggested fix:** Same pattern as BUG-002/003/004.
- **Regression test:** `backend/tests/knownIssues.idor.test.js` → `BUG-005`.

---

### BUG-006 — Notes API had no ownership check (IDOR)
- **Component:** `backend/src/controllers/note.controller.js`
- **Severity:** High
- **Status:** ✅ Fixed
- **Actual result (pre-fix):** Any authenticated user could list another user's notes by `tripId`, or update/delete any note by guessing its id. `updateNote` also mass-assigned the entire request body, so a caller could try to reassign a note's `tripId`/`userId`.
- **Fix:** Every query now scoped to `req.user.id`; `updateNote` whitelists only `title`/`content`.
- **Verification:** `backend/tests/notes.test.js` (8 tests).

---

### BUG-007 — Community share didn't verify trip ownership
- **Component:** `backend/src/controllers/community.controller.js` → `shareTrip`
- **Severity:** High
- **Status:** ✅ Fixed
- **Actual result (pre-fix):** `POST /api/community` accepted any `tripId` and published it (setting `isPublic: true`) with no check that the caller owned it — any user could make another user's private trip public.
- **Fix:** Looks up the trip scoped to `req.user.id` first; 404s otherwise.
- **Verification:** `backend/tests/community.test.js` (3 tests).

---

### BUG-008 — Password policy only checked length
- **Component:** `backend/src/controllers/auth.controller.js` (`signup`, `adminSignup`)
- **Severity:** Medium
- **Status:** ✅ Fixed
- **Actual result (pre-fix):** `password.length >= 8` was the only check, so `"aaaaaaaa"` or `"11111111"` were accepted.
- **Fix:** Requires at least one letter and one digit alongside the 8-char minimum.
- **Verification:** `backend/tests/auth.test.js` (weak-password cases).

---

### BUG-009 — No rate limiting on auth endpoints
- **Component:** `backend/src/routes/auth.routes.js`
- **Severity:** Medium
- **Status:** ✅ Fixed
- **Actual result (pre-fix):** `/api/auth/login` and `/api/auth/signup` had no request throttling, making credential-stuffing and signup spam trivial to automate.
- **Fix:** `express-rate-limit` applied to all `/api/auth/*` routes (20 req / 15 min) and, as defense-in-depth, to the whole `/api` surface (600 req / 15 min).
- **Verification:** `backend/tests/securityHeaders.test.js` confirms `RateLimit-*` headers are present on API responses. Actually triggering and asserting a 429 after N requests is not covered (would slow the suite significantly); tracked as a follow-up in `regression-checklist.md`.

---

### BUG-010 — Minimal HTTP security headers
- **Component:** `backend/src/app.js`
- **Severity:** Low
- **Status:** ✅ Fixed
- **Actual result (pre-fix):** Helmet was applied with defaults only (plus a relaxed CORP policy); no explicit CSP, HSTS, or referrer policy.
- **Fix:** Added a restrictive CSP (`default-src 'none'`, `frame-ancestors 'none'` — this is a JSON API, not a page-serving origin), HSTS, and `strict-origin-when-cross-origin` referrer policy.
- **Verification:** `backend/tests/securityHeaders.test.js` (2 tests).
