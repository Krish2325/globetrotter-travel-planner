require('dotenv').config();
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
