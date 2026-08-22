-- Convert money columns (basePrice, Budget.*, Expense.amount) from Float to
-- Int minor units (e.g. paise). SQLite has no exact Decimal type, and Float
-- can't represent currency exactly. Existing values are multiplied by 100
-- and rounded rather than truncated, so e.g. 199.99 -> 19999, not 19998.
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_trips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startingLocation" TEXT,
    "destination" TEXT,
    "durationDays" INTEGER,
    "packageType" TEXT,
    "basePrice" INTEGER,
    "bestSeason" TEXT,
    "coverImage" TEXT,
    "images" TEXT,
    "rating" REAL NOT NULL DEFAULT 0.0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "isTrending" BOOLEAN NOT NULL DEFAULT false,
    "maxPeople" INTEGER,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PLANNING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "trips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_trips" ("id", "userId", "title", "description", "startingLocation", "destination", "durationDays", "packageType", "basePrice", "bestSeason", "coverImage", "images", "rating", "views", "popularity", "isTrending", "maxPeople", "startDate", "endDate", "isPublic", "status", "createdAt", "updatedAt")
SELECT "id", "userId", "title", "description", "startingLocation", "destination", "durationDays", "packageType",
  CASE WHEN "basePrice" IS NULL THEN NULL ELSE CAST(ROUND("basePrice" * 100) AS INTEGER) END,
  "bestSeason", "coverImage", "images", "rating", "views", "popularity", "isTrending", "maxPeople", "startDate", "endDate", "isPublic", "status", "createdAt", "updatedAt"
FROM "trips";
DROP TABLE "trips";
ALTER TABLE "new_trips" RENAME TO "trips";
CREATE INDEX "trips_userId_idx" ON "trips"("userId");

CREATE TABLE "new_budgets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL,
    "totalBudget" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "accommodation" INTEGER,
    "food" INTEGER,
    "transport" INTEGER,
    "activities" INTEGER,
    "shopping" INTEGER,
    "miscellaneous" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "budgets_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_budgets" ("id", "tripId", "totalBudget", "currency", "accommodation", "food", "transport", "activities", "shopping", "miscellaneous", "createdAt", "updatedAt")
SELECT "id", "tripId",
  CAST(ROUND("totalBudget" * 100) AS INTEGER),
  "currency",
  CASE WHEN "accommodation" IS NULL THEN NULL ELSE CAST(ROUND("accommodation" * 100) AS INTEGER) END,
  CASE WHEN "food" IS NULL THEN NULL ELSE CAST(ROUND("food" * 100) AS INTEGER) END,
  CASE WHEN "transport" IS NULL THEN NULL ELSE CAST(ROUND("transport" * 100) AS INTEGER) END,
  CASE WHEN "activities" IS NULL THEN NULL ELSE CAST(ROUND("activities" * 100) AS INTEGER) END,
  CASE WHEN "shopping" IS NULL THEN NULL ELSE CAST(ROUND("shopping" * 100) AS INTEGER) END,
  CASE WHEN "miscellaneous" IS NULL THEN NULL ELSE CAST(ROUND("miscellaneous" * 100) AS INTEGER) END,
  "createdAt", "updatedAt"
FROM "budgets";
DROP TABLE "budgets";
ALTER TABLE "new_budgets" RENAME TO "budgets";
CREATE UNIQUE INDEX "budgets_tripId_key" ON "budgets"("tripId");

CREATE TABLE "new_expenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "category" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "notes" TEXT,
    "receiptUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "expenses_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_expenses" ("id", "tripId", "title", "amount", "currency", "category", "date", "notes", "receiptUrl", "createdAt")
SELECT "id", "tripId", "title",
  CAST(ROUND("amount" * 100) AS INTEGER),
  "currency", "category", "date", "notes", "receiptUrl", "createdAt"
FROM "expenses";
DROP TABLE "expenses";
ALTER TABLE "new_expenses" RENAME TO "expenses";
CREATE INDEX "expenses_tripId_idx" ON "expenses"("tripId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
