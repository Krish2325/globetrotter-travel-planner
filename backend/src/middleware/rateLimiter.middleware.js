const rateLimit = require('express-rate-limit');

// ── Strict limiter for auth endpoints (login/signup/admin-signup) ──────────────
// Mitigates brute-force credential guessing and account-creation spam.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in a few minutes.' },
});

// ── Looser limiter applied to the whole API as a baseline abuse guard ──────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 600,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
});

module.exports = { authLimiter, apiLimiter };
