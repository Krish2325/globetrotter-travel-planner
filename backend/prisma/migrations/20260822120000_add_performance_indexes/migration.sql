-- Add indexes on foreign keys and frequently-filtered columns to speed up
-- trip lookups, community/public browsing, and per-user queries.

-- CreateIndex
CREATE INDEX "trips_userId_idx" ON "trips"("userId");

-- CreateIndex
CREATE INDEX "trips_isPublic_status_idx" ON "trips"("isPublic", "status");

-- CreateIndex
CREATE INDEX "trips_isTrending_popularity_idx" ON "trips"("isTrending", "popularity");

-- CreateIndex
CREATE INDEX "trips_createdAt_idx" ON "trips"("createdAt");

-- CreateIndex
CREATE INDEX "stops_tripId_idx" ON "stops"("tripId");

-- CreateIndex
CREATE INDEX "stops_cityId_idx" ON "stops"("cityId");

-- CreateIndex
CREATE INDEX "activities_cityId_idx" ON "activities"("cityId");

-- CreateIndex
CREATE INDEX "expenses_tripId_idx" ON "expenses"("tripId");

-- CreateIndex
CREATE INDEX "checklists_tripId_idx" ON "checklists"("tripId");

-- CreateIndex
CREATE INDEX "checklists_userId_idx" ON "checklists"("userId");

-- CreateIndex
CREATE INDEX "notes_tripId_idx" ON "notes"("tripId");

-- CreateIndex
CREATE INDEX "notes_userId_idx" ON "notes"("userId");

-- CreateIndex
CREATE INDEX "community_shares_tripId_idx" ON "community_shares"("tripId");

-- CreateIndex
CREATE INDEX "community_shares_userId_idx" ON "community_shares"("userId");

-- CreateIndex
CREATE INDEX "community_shares_createdAt_idx" ON "community_shares"("createdAt");

-- CreateIndex
CREATE INDEX "trip_copies_originalTripId_idx" ON "trip_copies"("originalTripId");

-- CreateIndex
CREATE INDEX "trip_copies_copiedByUserId_idx" ON "trip_copies"("copiedByUserId");
