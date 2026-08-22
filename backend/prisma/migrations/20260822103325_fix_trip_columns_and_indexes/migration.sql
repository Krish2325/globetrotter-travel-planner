-- RedefineTables
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
    "basePrice" REAL,
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
INSERT INTO "new_trips" ("coverImage", "createdAt", "description", "endDate", "id", "isPublic", "startDate", "status", "title", "updatedAt", "userId") SELECT "coverImage", "createdAt", "description", "endDate", "id", "isPublic", "startDate", "status", "title", "updatedAt", "userId" FROM "trips";
DROP TABLE "trips";
ALTER TABLE "new_trips" RENAME TO "trips";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
