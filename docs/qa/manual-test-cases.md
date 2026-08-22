# Globetrotter — Manual Test Case Matrix (Frontend)

Status column values: `Pass` / `Fail` / `Blocked` / `Pending`. All cases below are
**Pending** — they were authored by reviewing the actual page implementations
under `frontend/src/pages` and `frontend/src/admin`, but could not be executed
in this sandbox (Node 18.x here vs. Vite 8 / ESLint 10's Node 20+ requirement
— see `test-plan.md` §6). Run these against a local dev server
(`npm run dev` in both `backend/` and `frontend/`) and fill in Status + Notes.

## Auth

| TC ID | Title | Steps | Expected Result | Status | Notes |
|---|---|---|---|---|---|
| TC-A01 | Signup with valid data | Go to `/signup`, fill name/email/password ≥8 chars incl. letter+number, submit | Redirected to `/dashboard`, token stored | Pending | |
| TC-A02 | Signup rejects weak password | Enter password `12345678` | Inline error shown, no navigation | Pending | Backend now enforces letter+number (see auth.test.js) |
| TC-A03 | Signup rejects mismatched confirm-password | Enter different values in Password / Confirm password | "Passwords do not match" shown before any API call | Pending | Client-side check in `SignupPage.jsx` |
| TC-A04 | Login with valid credentials | Go to `/login`, enter valid email/password | Redirected to `/dashboard` | Pending | |
| TC-A05 | Login with wrong password | Enter valid email, wrong password | Generic "Invalid email or password" error, no field disambiguation | Pending | |
| TC-A06 | Session restore on reload | Log in, refresh the page | Still authenticated (via `/auth/me` bootstrap in `AuthContext`) | Pending | |
| TC-A07 | 401 auto-logout | Manually expire/corrupt the stored token, trigger any API call | Redirected to `/login`, local storage cleared | Pending | Handled in `lib/api.js` response interceptor |
| TC-A08 | Admin signup requires invite code | Go to `/admin/signup`, submit without a code | Backend returns 403, error shown | Pending | New field added as part of BUG-001 fix |
| TC-A09 | Admin signup with correct invite code | Submit with the code configured in `ADMIN_SIGNUP_SECRET` | Account created with role ADMIN, redirected to `/admin` | Pending | |

## Trips / Dashboard

| TC ID | Title | Steps | Expected Result | Status | Notes |
|---|---|---|---|---|---|
| TC-T01 | Create a trip | `/trips/new`, fill title + dates, submit | Trip appears in `/trips` and dashboard "Your Trips" | Pending | |
| TC-T02 | Dashboard stats update | Create/complete trips, revisit `/dashboard` | Total/Upcoming/Completed counts reflect current data | Pending | |
| TC-T03 | Search trips (dashboard) | Type into the dashboard search box | List filters client-side by title | Pending | |
| TC-T04 | Grid/List view toggle | Click grid vs. list icon on dashboard | Trip layout switches accordingly | Pending | |
| TC-T05 | Delete a trip | On `/trips`, click delete on a trip card, confirm | Trip removed from list; native `confirm()` dialog appears first | Pending | Confirm dialog is a blocking native `window.confirm` |
| TC-T06 | Filter trips by status | On `/trips`, click a status chip (PLANNING/CONFIRMED/…) | Only matching trips shown | Pending | |
| TC-T07 | Cannot view another user's trip | Log in as User B, navigate directly to `/trips/<User A's trip id>` | 404 / "Trip not found", not the trip data | Pending | Backend-enforced, see trips.test.js |

## Itinerary / City & Activity Search

| TC ID | Title | Steps | Expected Result | Status | Notes |
|---|---|---|---|---|---|
| TC-I01 | Search a city | `/cities`, type "Paris" | Debounced (400ms) results list + map pin | Pending | |
| TC-I02 | Select a popular city | On `/cities` with empty query, click a popular-city tile | Map renders with marker for that city | Pending | |
| TC-I03 | Search activities by category | `/activities`, click a category chip | List filters to that category | Pending | |
| TC-I04 | Add a stop to a trip | Open a trip's itinerary builder, add a city as a stop | Stop appears in itinerary, day-ordered | Pending | |

## Budget / Checklist / Notes

| TC ID | Title | Steps | Expected Result | Status | Notes |
|---|---|---|---|---|---|
| TC-B01 | Create a trip budget | Open a trip → Budget tab, set total + category splits | Budget saved, totals reflected in UI | Pending | |
| TC-B02 | Add an expense | Budget/Expenses view, add an expense with amount+category+date | Expense listed, running total updates | Pending | |
| TC-C01 | Create a packing checklist | Trip → Checklist tab, create a list, add items | Items listed, checkable | Pending | |
| TC-C02 | Toggle checklist item | Click a checklist item's checkbox | Item marked complete, persists on reload | Pending | |
| TC-N01 | Create a trip note | Trip → Notes tab, add title + content | Note appears in list | Pending | |
| TC-N02 | Edit / delete a note | Edit a note's content; delete a note | Changes persist; deleted note disappears | Pending | |

## Community

| TC ID | Title | Steps | Expected Result | Status | Notes |
|---|---|---|---|---|---|
| TC-CM01 | Share a trip publicly | From a trip you own, share to community with title/description | Trip becomes public, appears at `/community` | Pending | |
| TC-CM02 | Cannot share a trip you don't own | Craft a request with another user's tripId (e.g. via devtools) | Backend returns 404, no share created | Pending | Regression-tested in community.test.js |
| TC-CM03 | Copy a shared trip | Open a public share at `/community/:slug`, click "Copy trip" | New trip created under your account | Pending | |
| TC-CM04 | Delete your own share | From a share you own, delete it | Share removed from `/community` | Pending | |

## Admin console

| TC ID | Title | Steps | Expected Result | Status | Notes |
|---|---|---|---|---|---|
| TC-AD01 | Non-admin cannot reach admin routes | Log in as a normal USER, navigate to `/admin` | Redirected to `/admin/login` (frontend guard) and API calls 403 (backend guard) | Pending | |
| TC-AD02 | Admin manages cities | `/admin/cities`, add/edit/delete a city | Changes reflected; `/cities` search picks them up | Pending | |
| TC-AD03 | Admin manages trips catalog | `/admin/trips`, create/edit a catalog trip | Trip visible via `/api/trips/public` | Pending | |
| TC-AD04 | Analytics dashboard loads | `/admin` (dashboard) and `/admin/analytics` | Charts render without console errors | Pending | |
