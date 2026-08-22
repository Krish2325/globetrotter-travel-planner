# Globetrotter — QA Summary Report

**Branch:** `krish` **Date:** 2026-08-22 **QA:** Krish Suthar

## What was covered

- Full backend controller/route review for authorization gaps (every file
  under `backend/src/controllers` and `backend/src/routes`).
- Automated regression suite: **8 test suites / 42 tests**, run via
  `npm test` in `backend/` (Jest + Supertest, Prisma mocked — see
  `test-plan.md` §2 for why).
- Manual test case matrix authored for the frontend (29 cases across auth,
  trips, itinerary/search, budget/checklist/notes, community, admin) —
  see `manual-test-cases.md` for execution status.
- 10 bugs logged (`bug-reports.md`): 6 fixed and verified by automated
  tests, 4 open (High severity, same IDOR class, isolated to
  budget/checklist/expense/stop APIs).

## Result summary

| Category | Count |
|---|---|
| Bugs found | 10 |
| Fixed & verified | 6 (BUG-001, 006, 007, 008, 009, 010) |
| Open | 4 (BUG-002, 003, 004, 005 — all High, all IDOR) |
| Automated tests added | 42 |
| Manual test cases authored | 29 (execution pending — see limitation below) |

## Risk assessment

The fixed issues closed a **Critical** (unauthenticated admin account
creation) and two **High** (cross-user data access on notes and community
sharing) vulnerability. The four still-open findings are the *same class* of
bug on four more resource types — they were caught by applying the same
review pattern that found the fixed ones, but a code fix was out of scope
for this QA pass and is left to whoever owns those controllers, using the
regression-checklist.md pre-merge gate to avoid a fifth recurrence.

**Recommendation: do not treat budget/checklist/expense/stop endpoints as
safe for any user's private financial or itinerary data until BUG-002
through BUG-005 are fixed.** None of them are exposed to unauthenticated
users (all require a valid JWT), so the risk is scoped to authenticated
user-vs-user data leakage/tampering, not full anonymous compromise.

## Known limitation of this pass

This sandbox runs Node.js 18.15; the frontend toolchain
(`vite@8`, `eslint@10`, `react-router@7`) requires Node 20+ and would not
run here (`ReferenceError: CustomEvent is not defined` from Vite's CLI,
`util.styleText is not a function` from ESLint). No automated frontend
tests were added as a result, and the manual test cases in
`manual-test-cases.md` are unexecuted. Re-run this pass on a Node 20+/22+
environment to close that gap.

## Sign-off

QA sign-off is **conditional**: backend auth/authorization regressions are
covered and green; frontend functional coverage and the four open IDOR bugs
are the residual risk carried forward, both to be addressed before this
branch is considered release-ready.
