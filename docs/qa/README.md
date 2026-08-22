# QA Documentation — Globetrotter

Start with [`qa-summary-report.md`](./qa-summary-report.md) for the headline
results. The rest, in the order a reviewer would want them:

| Doc | Purpose |
|---|---|
| [`test-plan.md`](./test-plan.md) | Scope, environments, approach, entry/exit criteria |
| [`bug-reports.md`](./bug-reports.md) | BUG-001..BUG-010, repro steps, fix status |
| [`manual-test-cases.md`](./manual-test-cases.md) | 29 frontend test cases (Pending — run against a local dev server) |
| [`regression-checklist.md`](./regression-checklist.md) | Run before merging any auth/authorization change |
| [`qa-summary-report.md`](./qa-summary-report.md) | Coverage summary, risk assessment, sign-off |

## Running the automated suite

```bash
cd backend
npm install
npm test
```

Expect `8 test suites / 42 tests` passing, including
`tests/knownIssues.idor.test.js`, whose `test.failing` cases are *supposed*
to fail (they document BUG-002 through BUG-005) — see that file's header
comment before "fixing" it.
