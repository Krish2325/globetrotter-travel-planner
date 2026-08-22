// Jest setupFiles — runs before the test framework is installed, so env vars
// are in place before any app module (which reads them at require-time) loads.
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-do-not-use-in-prod';
process.env.JWT_EXPIRES_IN = '1h';
process.env.ADMIN_SIGNUP_SECRET = 'test-admin-invite-code';
