// prisma/seed.js — Full rich seed for Globetrotter
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Globetrotter database...');

  // ── Admin user ──────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('admin@1234', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@globetrotter.dev' },
    update: {},
    create: { name: 'Globetrotter Admin', email: 'admin@globetrotter.dev', passwordHash: adminHash, role: 'ADMIN', isEmailVerified: true },
  });

  // ── Demo user ───────────────────────────────────────────────────────────────
  const userHash = await bcrypt.hash('demo@1234', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@globetrotter.dev' },
    update: {},
    create: { name: 'Areen Sharma', email: 'demo@globetrotter.dev', passwordHash: userHash, role: 'USER', isEmailVerified: true },
  });

  console.log('✅ Users created');

  // ── Cities ──────────────────────────────────────────────────────────────────
  const cityData = [
    { name:'Bali',       country:'Indonesia',   countryCode:'ID', latitude:-8.4095,  longitude:115.1889, timezone:'Asia/Makassar', imageUrl:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', description:'The Island of Gods – lush rice terraces, ancient temples, surf beaches and vibrant nightlife.' },
    { name:'Goa',        country:'India',       countryCode:'IN', latitude:15.2993,  longitude:74.1240,  timezone:'Asia/Kolkata',  imageUrl:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', description:'Sun-kissed beaches, Portuguese heritage, seafood and a laid-back vibe on India\'s west coast.' },
    { name:'Paris',      country:'France',      countryCode:'FR', latitude:48.8566,  longitude:2.3522,   timezone:'Europe/Paris',  imageUrl:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', description:'The City of Light – art, fashion, cuisine, the Eiffel Tower and romance on the Seine.' },
    { name:'Tokyo',      country:'Japan',       countryCode:'JP', latitude:35.6762,  longitude:139.6503, timezone:'Asia/Tokyo',    imageUrl:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', description:'Where ancient tradition meets neon-lit future – sushi, anime, shrines and hyper-modern tech.' },
    { name:'Jaipur',     country:'India',       countryCode:'IN', latitude:26.9124,  longitude:75.7873,  timezone:'Asia/Kolkata',  imageUrl:'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80', description:'The Pink City – majestic Rajput forts, camel safaris, colourful bazaars and Mughal cuisine.' },
    { name:'Maldives',   country:'Maldives',    countryCode:'MV', latitude:3.2028,   longitude:73.2207,  timezone:'Indian/Maldives',imageUrl:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80', description:'Crystal lagoons, overwater bungalows, world-class diving and pristine coral reefs.' },
    { name:'Switzerland',country:'Switzerland', countryCode:'CH', latitude:46.8182,  longitude:8.2275,   timezone:'Europe/Zurich', imageUrl:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80', description:'Alpine peaks, glacier lakes, precision watches and the best chocolate on earth.' },
    { name:'Dubai',      country:'UAE',         countryCode:'AE', latitude:25.2048,  longitude:55.2708,  timezone:'Asia/Dubai',    imageUrl:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', description:'Desert skyline of superlatives – tallest tower, largest mall, gold souk and desert safaris.' },
    { name:'Kerala',     country:'India',       countryCode:'IN', latitude:10.8505,  longitude:76.2711,  timezone:'Asia/Kolkata',  imageUrl:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', description:'God\'s Own Country – backwater houseboats, lush spice plantations and Ayurveda retreats.' },
    { name:'Manali',     country:'India',       countryCode:'IN', latitude:32.2396,  longitude:77.1887,  timezone:'Asia/Kolkata',  imageUrl:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80', description:'Snow-capped Himalayan valley – adventure sports, river rafting, ancient monasteries.' },
  ];

  const cities = {};
  for (const c of cityData) {
    const city = await prisma.city.upsert({
      where: { name_country: { name: c.name, country: c.country } },
      update: { imageUrl: c.imageUrl, description: c.description },
      create: c,
    });
    cities[c.name] = city;
  }
  console.log('✅ 10 cities created');

  // ── Activities ──────────────────────────────────────────────────────────────
  const activities = [
    { cityId:cities['Bali'].id,     name:'Ubud Rice Terrace Walk',   category:'SIGHTSEEING', durationMin:180, costEstimate:500,    description:'Walk through iconic Tegallalang terraces at sunrise.' },
    { cityId:cities['Bali'].id,     name:'Seminyak Surf Lesson',      category:'ADVENTURE',   durationMin:120, costEstimate:1500,   description:'Learn to surf with professional instructors on Seminyak beach.' },
    { cityId:cities['Goa'].id,      name:'Dudhsagar Waterfall Trek',  category:'ADVENTURE',   durationMin:360, costEstimate:800,    description:'Jungle trek to India\'s second tallest waterfall.' },
    { cityId:cities['Goa'].id,      name:'Candolim Beach Cruise',     category:'RELAXATION',  durationMin:120, costEstimate:600,    description:'Sunset cruise along the Goa coastline with live music.' },
    { cityId:cities['Paris'].id,    name:'Eiffel Tower Summit Tour',  category:'SIGHTSEEING', durationMin:150, costEstimate:4000,   description:'Skip-the-line summit access with panoramic Paris views.' },
    { cityId:cities['Paris'].id,    name:'Louvre Museum Private Tour',category:'CULTURE',     durationMin:240, costEstimate:6000,   description:'Expert-guided tour through Da Vinci, Venus de Milo and Mona Lisa.' },
    { cityId:cities['Tokyo'].id,    name:'Tsukiji Market Food Tour',  category:'FOOD',        durationMin:180, costEstimate:3500,   description:'Sample fresh sushi, sashimi and Japanese street food.' },
    { cityId:cities['Tokyo'].id,    name:'Shibuya Night Walk',        category:'SIGHTSEEING', durationMin:120, costEstimate:0,      description:'Experience the world\'s busiest crossing and neon cityscape.' },
    { cityId:cities['Jaipur'].id,   name:'Amber Fort Elephant Ride',  category:'CULTURE',     durationMin:90,  costEstimate:1200,   description:'Ride elephants up to the majestic Amber Fort.' },
    { cityId:cities['Jaipur'].id,   name:'Rajasthani Cooking Class',  category:'FOOD',        durationMin:180, costEstimate:800,    description:'Learn to cook Dal Baati Churma and other royal recipes.' },
    { cityId:cities['Maldives'].id, name:'Sunset Dolphin Cruise',     category:'RELAXATION',  durationMin:180, costEstimate:8000,   description:'Sail at sunset and watch spinner dolphins frolic.' },
    { cityId:cities['Maldives'].id, name:'Coral Reef Snorkelling',    category:'ADVENTURE',   durationMin:120, costEstimate:3500,   description:'Snorkel vibrant coral gardens with colourful reef fish.' },
    { cityId:cities['Kerala'].id,   name:'Alleppey Houseboat Stay',   category:'RELAXATION',  durationMin:1440,costEstimate:12000,  description:'Overnight on a traditional Kerala houseboat through backwaters.' },
    { cityId:cities['Manali'].id,   name:'Rohtang Pass Snow Safari',  category:'ADVENTURE',   durationMin:480, costEstimate:2000,   description:'Drive through high-altitude snow pass with glacier views.' },
    { cityId:cities['Dubai'].id,    name:'Desert Dune Bashing',       category:'ADVENTURE',   durationMin:300, costEstimate:5000,   description:'4WD dune bashing, camel ride and BBQ dinner under stars.' },
  ];

  for (const act of activities) {
    await prisma.activity.upsert({
      where: { id: act.id || 'skip' },
      update: {},
      create: act,
    }).catch(() => prisma.activity.create({ data: act }));
  }
  console.log('✅ 15 activities created');

  // ── Trips (catalog — created by admin, publicly visible) ───────────────────
  const tripData = [
    {
      userId:admin.id, title:'Bali Premium Package', destination:'Bali, Indonesia',
      startingLocation:'Mumbai, India', description:'8 days of pure bliss — private villas, rice terrace walks, temple ceremonies, and surf lessons. The ultimate Bali experience.',
      durationDays:8, packageType:'LUXURY', basePrice:75000, bestSeason:'Summer',
      coverImage:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      rating:4.8, views:2400, popularity:95, isTrending:true, maxPeople:2,
      startDate:new Date('2025-06-01'), endDate:new Date('2025-06-08'),
      isPublic:true, status:'AVAILABLE',
    },
    {
      userId:admin.id, title:'Swiss Alps Luxury Escape', destination:'Switzerland',
      startingLocation:'Delhi, India', description:'10 days through Zurich, Lucerne, Interlaken and Zermatt — skiing, glacier walks, chocolate tours and luxury chalets.',
      durationDays:10, packageType:'LUXURY', basePrice:250000, bestSeason:'Winter',
      coverImage:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
      rating:4.9, views:1800, popularity:88, isTrending:true, maxPeople:2,
      startDate:new Date('2025-12-15'), endDate:new Date('2025-12-25'),
      isPublic:true, status:'AVAILABLE',
    },
    {
      userId:admin.id, title:'Goa Beach Weekend', destination:'Goa, India',
      startingLocation:'Mumbai, India', description:'5-day sun and surf escape to Goa — beach resorts, water sports, seafood, Portuguese churches and sunset cruises.',
      durationDays:5, packageType:'BUDGET', basePrice:28000, bestSeason:'Winter',
      coverImage:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
      rating:4.6, views:3100, popularity:92, isTrending:true, maxPeople:4,
      startDate:new Date('2025-11-10'), endDate:new Date('2025-11-14'),
      isPublic:true, status:'AVAILABLE',
    },
    {
      userId:admin.id, title:'Rajasthan Heritage Circuit', destination:'Rajasthan, India',
      startingLocation:'Delhi, India', description:'7-day royal journey through Jaipur, Jodhpur and Udaipur — forts, palaces, camel safaris and folk dances.',
      durationDays:7, packageType:'CULTURAL', basePrice:35000, bestSeason:'Winter',
      coverImage:'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
      rating:4.7, views:1560, popularity:80, isTrending:false, maxPeople:6,
      startDate:new Date('2025-10-20'), endDate:new Date('2025-10-26'),
      isPublic:true, status:'AVAILABLE',
    },
    {
      userId:admin.id, title:'Maldives Honeymoon Retreat', destination:'Maldives',
      startingLocation:'Bangalore, India', description:'6-day overwater villa experience — private beach, couple\'s spa, snorkelling, sunset dolphin cruise and candlelit dinners.',
      durationDays:6, packageType:'HONEYMOON', basePrice:180000, bestSeason:'All Year',
      coverImage:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
      rating:4.9, views:4200, popularity:98, isTrending:true, maxPeople:2,
      startDate:new Date('2025-02-01'), endDate:new Date('2025-02-06'),
      isPublic:true, status:'AVAILABLE',
    },
    {
      userId:admin.id, title:'Kerala Backwaters & Wellness', destination:'Kerala, India',
      startingLocation:'Kochi, India', description:'4-day rejuvenation — houseboat through Alleppey backwaters, Ayurveda spa, spice plantation tour and Kathakali performance.',
      durationDays:4, packageType:'FAMILY', basePrice:28000, bestSeason:'Monsoon',
      coverImage:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
      rating:4.5, views:980, popularity:70, isTrending:false, maxPeople:4,
      startDate:new Date('2025-07-15'), endDate:new Date('2025-07-18'),
      isPublic:true, status:'AVAILABLE',
    },
    {
      userId:admin.id, title:'Tokyo Cultural Immersion', destination:'Tokyo, Japan',
      startingLocation:'Delhi, India', description:'8-day deep dive into Japanese culture — Tsukiji market, Shibuya crossing, Kyoto temples, anime districts and authentic ramen.',
      durationDays:8, packageType:'CULTURAL', basePrice:120000, bestSeason:'Spring',
      coverImage:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      rating:4.8, views:2100, popularity:85, isTrending:true, maxPeople:2,
      startDate:new Date('2025-04-01'), endDate:new Date('2025-04-08'),
      isPublic:true, status:'AVAILABLE',
    },
    {
      userId:admin.id, title:'Manali Adventure Camp', destination:'Manali, India',
      startingLocation:'Delhi, India', description:'5-day Himalayan adventure — river rafting on Beas, Rohtang Pass snow safari, trekking, camping under stars and paragliding.',
      durationDays:5, packageType:'ADVENTURE', basePrice:22000, bestSeason:'Summer',
      coverImage:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
      rating:4.6, views:1340, popularity:75, isTrending:false, maxPeople:8,
      startDate:new Date('2025-05-25'), endDate:new Date('2025-05-29'),
      isPublic:true, status:'AVAILABLE',
    },
    {
      userId:admin.id, title:'Dubai City & Desert Package', destination:'Dubai, UAE',
      startingLocation:'Mumbai, India', description:'6-day Dubai extravaganza — Burj Khalifa, Gold Souk, desert dune bashing, Atlantis waterpark and Dubai Mall luxury shopping.',
      durationDays:6, packageType:'LUXURY', basePrice:95000, bestSeason:'Winter',
      coverImage:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      rating:4.7, views:2850, popularity:88, isTrending:true, maxPeople:4,
      startDate:new Date('2025-12-20'), endDate:new Date('2025-12-25'),
      isPublic:true, status:'AVAILABLE',
    },
    // Inactive / Draft trips
    {
      userId:admin.id, title:'Paris Art & Cuisine Tour', destination:'Paris, France',
      startingLocation:'Mumbai, India', description:'Coming soon — 7-day Paris experience focusing on art museums, fine dining and fashion districts.',
      durationDays:7, packageType:'CULTURAL', basePrice:200000, bestSeason:'Spring',
      coverImage:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      rating:0, views:0, popularity:0, isTrending:false, maxPeople:2,
      startDate:new Date('2026-03-01'), endDate:new Date('2026-03-07'),
      isPublic:false, status:'PLANNING',
    },
    // Demo user personal trip
    {
      userId:demoUser.id, title:'My Goa Trip', destination:'Goa, India',
      startingLocation:'Mumbai', description:'Personal trip to Goa with friends.',
      durationDays:4, packageType:'BUDGET', basePrice:20000, bestSeason:'Winter',
      coverImage:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
      rating:0, views:0, popularity:0, isTrending:false, maxPeople:4,
      startDate:new Date('2025-12-28'), endDate:new Date('2025-12-31'),
      isPublic:false, status:'PLANNING',
    },
  ];

  const trips = [];
  for (const t of tripData) {
    const trip = await prisma.trip.create({ data: t });
    trips.push(trip);
  }
  console.log(`✅ ${trips.length} trips created`);

  // ── Community posts ─────────────────────────────────────────────────────────
  const publicTrips = trips.filter(t => t.isPublic && t.status === 'AVAILABLE');
  for (let i = 0; i < Math.min(4, publicTrips.length); i++) {
    const t = publicTrips[i];
    await prisma.communityShare.create({
      data: {
        tripId: t.id, userId: admin.id,
        slug: t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i,
        title: t.title, description: t.description,
        tags: t.packageType, likesCount: Math.floor(Math.random() * 200),
        viewsCount: t.views,
      },
    }).catch(() => {});
  }
  console.log('✅ Community posts created');

  console.log('\n🎉 Seeding complete!');
  console.log('📧 Admin login: admin@globetrotter.dev / admin@1234');
  console.log('📧 Demo login:  demo@globetrotter.dev  / demo@1234');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
