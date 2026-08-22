const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/public.controller");

// Trips
router.get("/trips",              ctrl.getPublicTrips);
router.get("/trips/recommended",  ctrl.getRecommendedTrips);
router.get("/trips/active",       ctrl.getActiveTrips);
router.get("/trips/trending",     ctrl.getTrendingTrips);

// Cities
router.get("/cities",             ctrl.getPublicCities);
router.get("/cities/popular",     ctrl.getPopularCities);

// Activities
router.get("/activities",         ctrl.getPublicActivities);

// Unified search
router.get("/search",             ctrl.globalSearch);

module.exports = router;