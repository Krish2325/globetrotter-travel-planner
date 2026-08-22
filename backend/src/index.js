require('dotenv').config();

// Fail fast rather than silently signing tokens with `undefined` as the secret.
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set. Refusing to start — see backend/.env.example');
  process.exit(1);
}

const app = require('./app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// ── Prevent unhandled rejections from killing the process ──────────────────────
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️  Unhandled Rejection at:', promise, 'reason:', reason);
  // Do NOT exit — keep server alive
});

process.on('uncaughtException', (err) => {
  console.error('⚠️  Uncaught Exception:', err);
  // Do NOT exit — keep server alive
});

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected (SQLite)');

    app.listen(PORT, '127.0.0.1', () => {
      console.log(`🚀 Globetrotter API running on http://127.0.0.1:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1);
  }
}

main();
