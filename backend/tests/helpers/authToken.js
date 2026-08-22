const jwt = require('jsonwebtoken');

// Signs a token the same way auth.controller.signToken does, so
// auth.middleware's jwt.verify(token, process.env.JWT_SECRET) accepts it.
const makeToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

module.exports = { makeToken };
