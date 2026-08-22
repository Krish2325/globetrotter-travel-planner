-- CreateIndex
CREATE INDEX "activities_cityId_idx" ON "activities"("cityId");

-- CreateIndex
CREATE INDEX "checklists_tripId_idx" ON "checklists"("tripId");

-- CreateIndex
CREATE INDEX "checklists_userId_idx" ON "checklists"("userId");

-- CreateIndex
CREATE INDEX "community_shares_tripId_idx" ON "community_shares"("tripId");

-- CreateIndex
CREATE INDEX "community_shares_userId_idx" ON "community_shares"("userId");

-- CreateIndex
CREATE INDEX "expenses_tripId_idx" ON "expenses"("tripId");

-- CreateIndex
CREATE INDEX "notes_tripId_idx" ON "notes"("tripId");

-- CreateIndex
CREATE INDEX "notes_userId_idx" ON "notes"("userId");

-- CreateIndex
CREATE INDEX "stops_tripId_idx" ON "stops"("tripId");

-- CreateIndex
CREATE INDEX "stops_cityId_idx" ON "stops"("cityId");

-- CreateIndex
CREATE INDEX "trip_copies_originalTripId_idx" ON "trip_copies"("originalTripId");

-- CreateIndex
CREATE INDEX "trips_userId_idx" ON "trips"("userId");
