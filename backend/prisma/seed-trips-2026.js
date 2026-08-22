/**
 * Curated trip catalog reset — run with: node prisma/seed-trips-2026.js
 * Wipes existing Trip data (and cascaded Stops/Budgets/Expenses/Checklists/Notes/
 * CommunityShares/TripCopies tied to trips) and replaces it with 50 curated
 * packages: 25 Gujarat, 10 other-India, 15 international.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const img = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;

// ── 25 Gujarat trips ──────────────────────────────────────────────────────────
const gujarat = [
  { title: 'Rann of Kutch White Desert Festival', destination: 'Rann of Kutch, Gujarat', durationDays: 4, packageType: 'CULTURAL', basePrice: 18000, bestSeason: 'Winter', maxPeople: 6, description: 'Camp under the stars on the salt-white desert, folk music, handicraft bazaars and a full-moon jeep safari.' },
  { title: 'Statue of Unity Grand Tour', destination: 'Kevadia, Gujarat', durationDays: 2, packageType: 'FAMILY', basePrice: 9000, bestSeason: 'Winter', maxPeople: 6, description: "Visit the world's tallest statue, Sardar Sarovar Dam, Valley of Flowers and the Cactus Garden." },
  { title: 'Gir National Park Lion Safari', destination: 'Gir Forest, Gujarat', durationDays: 3, packageType: 'ADVENTURE', basePrice: 14000, bestSeason: 'Winter', maxPeople: 6, description: 'Track Asiatic lions in the wild with expert naturalists on jeep safaris through Gir forest.' },
  { title: 'Somnath Temple Pilgrimage', destination: 'Somnath, Gujarat', durationDays: 2, packageType: 'CULTURAL', basePrice: 8000, bestSeason: 'Winter', maxPeople: 8, description: 'Sunrise darshan at the first Jyotirlinga, evening light-and-sound show and Triveni Sangam visit.' },
  { title: 'Dwarka Temple Yatra', destination: 'Dwarka, Gujarat', durationDays: 3, packageType: 'CULTURAL', basePrice: 10500, bestSeason: 'Winter', maxPeople: 8, description: "Dwarkadhish Temple, Bet Dwarka boat crossing and Nageshwar Jyotirlinga on Krishna's ancient coastal capital." },
  { title: 'Diu Beach Getaway', destination: 'Diu, Gujarat', durationDays: 3, packageType: 'RELAXATION', basePrice: 11000, bestSeason: 'Winter', maxPeople: 4, description: 'Nagoa Beach, Portuguese-era fort, seafood shacks and a laid-back coastal escape.' },
  { title: 'Ahmedabad Heritage Walk', destination: 'Ahmedabad, Gujarat', durationDays: 2, packageType: 'CULTURAL', basePrice: 6500, bestSeason: 'Winter', maxPeople: 8, description: "Old-city stepwells, Sabarmati Ashram, Jama Masjid and Gujarat's famous street-food trail." },
  { title: 'Vadodara Royal Heritage Tour', destination: 'Vadodara, Gujarat', durationDays: 2, packageType: 'CULTURAL', basePrice: 7000, bestSeason: 'Winter', maxPeople: 6, description: 'Laxmi Vilas Palace, Sayaji Baug and the museums of the former Baroda State.' },
  { title: 'Rajkot City & Culture Tour', destination: 'Rajkot, Gujarat', durationDays: 2, packageType: 'FAMILY', basePrice: 6000, bestSeason: 'Winter', maxPeople: 6, description: "Watson Museum, Kaba Gandhi No Delo and Rajkot's legendary Saurashtrian thali trail." },
  { title: 'Surat Textile & Diamond Tour', destination: 'Surat, Gujarat', durationDays: 2, packageType: 'CULTURAL', basePrice: 6500, bestSeason: 'Winter', maxPeople: 6, description: "Diamond-cutting workshops, Dutch cemetery and Surat's riverside promenade." },
  { title: 'Saputara Hill Station Retreat', destination: 'Saputara, Gujarat', durationDays: 3, packageType: 'RELAXATION', basePrice: 9500, bestSeason: 'Monsoon', maxPeople: 4, description: "Gujarat's only hill station — lake boating, ropeway rides and misty tribal-forest trails." },
  { title: 'Palitana Jain Temple Trek', destination: 'Palitana, Gujarat', durationDays: 2, packageType: 'ADVENTURE', basePrice: 7500, bestSeason: 'Winter', maxPeople: 6, description: '3,900-step pilgrim climb to the marble temple city crowning Shatrunjaya Hill.' },
  { title: 'Champaner-Pavagadh UNESCO Tour', destination: 'Champaner, Gujarat', durationDays: 2, packageType: 'CULTURAL', basePrice: 7000, bestSeason: 'Winter', maxPeople: 6, description: 'A UNESCO World Heritage city of mosques, forts and the hilltop Kalika Mata Temple.' },
  { title: 'Patan Rani ki Vav & Modhera Tour', destination: 'Patan, Gujarat', durationDays: 2, packageType: 'CULTURAL', basePrice: 6800, bestSeason: 'Winter', maxPeople: 6, description: 'The stepwell of Rani ki Vav and the Sun Temple at Modhera, plus Patola silk weaving demos.' },
  { title: 'Gandhinagar Akshardham Tour', destination: 'Gandhinagar, Gujarat', durationDays: 1, packageType: 'FAMILY', basePrice: 3500, bestSeason: 'Winter', maxPeople: 8, description: 'Akshardham Temple complex with its musical fountain and Sahajanand Van gardens.' },
  { title: 'Porbandar Gandhi Heritage Tour', destination: 'Porbandar, Gujarat', durationDays: 2, packageType: 'CULTURAL', basePrice: 6500, bestSeason: 'Winter', maxPeople: 6, description: "Mahatma Gandhi's birthplace, Kirti Mandir and the Porbandar coastline." },
  { title: 'Mandvi Beach & Vijay Vilas Palace', destination: 'Mandvi, Gujarat', durationDays: 2, packageType: 'RELAXATION', basePrice: 8000, bestSeason: 'Winter', maxPeople: 6, description: "Windswept beaches, a shipbuilding yard and Kutch royalty's seaside palace." },
  { title: 'Nal Sarovar Bird Sanctuary Tour', destination: 'Nal Sarovar, Gujarat', durationDays: 1, packageType: 'ADVENTURE', basePrice: 3000, bestSeason: 'Winter', maxPeople: 8, description: 'Boat safari among flamingos, pelicans and migratory birds on Gujarat\'s largest wetland.' },
  { title: 'Ambaji Temple Pilgrimage', destination: 'Ambaji, Gujarat', durationDays: 2, packageType: 'CULTURAL', basePrice: 5500, bestSeason: 'Winter', maxPeople: 8, description: 'One of the 51 Shakti Peethas, with a ropeway to the Gabbar Hill shrine.' },
  { title: 'Junagadh Girnar Trek', destination: 'Junagadh, Gujarat', durationDays: 2, packageType: 'ADVENTURE', basePrice: 7000, bestSeason: 'Winter', maxPeople: 6, description: '10,000-step trek up Girnar Hill past Jain and Hindu temples, plus Uparkot Fort.' },
  { title: 'Vadnagar Heritage Tour', destination: 'Vadnagar, Gujarat', durationDays: 1, packageType: 'CULTURAL', basePrice: 3500, bestSeason: 'Winter', maxPeople: 6, description: 'A 2,700-year-old town of toranas, Sharmishtha Lake and ongoing archaeological digs.' },
  { title: 'Polo Forest Camping Retreat', destination: 'Polo Forest, Gujarat', durationDays: 2, packageType: 'ADVENTURE', basePrice: 6500, bestSeason: 'Monsoon', maxPeople: 6, description: 'Riverside camping in a hidden forest of ancient temple ruins and dense teak jungle.' },
  { title: 'Veraval Coastal Village Tour', destination: 'Veraval, Gujarat', durationDays: 2, packageType: 'RELAXATION', basePrice: 6000, bestSeason: 'Winter', maxPeople: 6, description: "Gujarat's biggest fishing harbour, dhow-building yards and a quiet coastal sunset." },
  { title: 'Bhuj Kutch Handicraft & Culture Tour', destination: 'Bhuj, Gujarat', durationDays: 3, packageType: 'CULTURAL', basePrice: 10000, bestSeason: 'Winter', maxPeople: 6, description: 'Bandhani, embroidery and Rogan-art village visits around the historic Kutch capital.' },
  { title: 'Jamnagar Marine National Park Tour', destination: 'Jamnagar, Gujarat', durationDays: 2, packageType: 'ADVENTURE', basePrice: 8500, bestSeason: 'Winter', maxPeople: 6, description: "India's first marine sanctuary — coral reefs, mangroves and glass-bottom boat rides." },
];

// ── 10 other-India trips ──────────────────────────────────────────────────────
const india = [
  { title: 'Goa Beach Weekend', destination: 'Goa, India', durationDays: 4, packageType: 'BUDGET', basePrice: 20000, bestSeason: 'Winter', maxPeople: 4, description: 'Beach resorts, water sports, seafood shacks and Portuguese-era churches.' },
  { title: 'Jaipur Royal Rajasthan Tour', destination: 'Jaipur, Rajasthan', durationDays: 5, packageType: 'CULTURAL', basePrice: 32000, bestSeason: 'Winter', maxPeople: 6, description: 'Amber Fort, City Palace, Hawa Mahal and camel safaris through the Pink City.' },
  { title: 'Kerala Backwaters & Wellness', destination: 'Kerala, India', durationDays: 4, packageType: 'FAMILY', basePrice: 28000, bestSeason: 'Monsoon', maxPeople: 4, description: 'Houseboat cruises through Alleppey, Ayurveda spa and spice-plantation walks.' },
  { title: 'Manali Adventure Camp', destination: 'Manali, Himachal Pradesh', durationDays: 5, packageType: 'ADVENTURE', basePrice: 22000, bestSeason: 'Summer', maxPeople: 8, description: 'River rafting, Rohtang Pass snow safari, trekking and paragliding in the Himalayas.' },
  { title: 'Rishikesh Yoga & Rafting Retreat', destination: 'Rishikesh, Uttarakhand', durationDays: 4, packageType: 'ADVENTURE', basePrice: 16000, bestSeason: 'Spring', maxPeople: 6, description: 'Ganga-side yoga sessions, white-water rafting and the evening Ganga Aarti.' },
  { title: 'Agra Taj Mahal Tour', destination: 'Agra, Uttar Pradesh', durationDays: 2, packageType: 'CULTURAL', basePrice: 12000, bestSeason: 'Winter', maxPeople: 6, description: 'Sunrise at the Taj Mahal, Agra Fort and Fatehpur Sikri day trip.' },
  { title: 'Varanasi Spiritual Journey', destination: 'Varanasi, Uttar Pradesh', durationDays: 3, packageType: 'CULTURAL', basePrice: 14000, bestSeason: 'Winter', maxPeople: 6, description: 'Sunrise Ganga boat ride, Kashi Vishwanath Temple and the Dashashwamedh Ghat Aarti.' },
  { title: 'Leh-Ladakh Bike Expedition', destination: 'Leh, Ladakh', durationDays: 8, packageType: 'ADVENTURE', basePrice: 55000, bestSeason: 'Summer', maxPeople: 6, description: 'High-altitude passes, Pangong Lake and monasteries on a Royal Enfield expedition.' },
  { title: 'Andaman Islands Beach Escape', destination: 'Andaman Islands, India', durationDays: 6, packageType: 'HONEYMOON', basePrice: 65000, bestSeason: 'Winter', maxPeople: 2, description: 'Radhanagar Beach, scuba diving at Havelock and glass-bottom boat rides to coral reefs.' },
  { title: 'Darjeeling Tea Garden Retreat', destination: 'Darjeeling, West Bengal', durationDays: 4, packageType: 'RELAXATION', basePrice: 24000, bestSeason: 'Spring', maxPeople: 4, description: 'Toy-train ride, tea-estate stays and sunrise over Kanchenjunga from Tiger Hill.' },
];

// ── 15 international trips ────────────────────────────────────────────────────
const international = [
  { title: 'Bali Premium Package', destination: 'Bali, Indonesia', durationDays: 8, packageType: 'LUXURY', basePrice: 75000, bestSeason: 'Summer', maxPeople: 2, description: 'Private villas, rice-terrace walks, temple ceremonies and surf lessons.' },
  { title: 'Swiss Alps Luxury Escape', destination: 'Switzerland', durationDays: 10, packageType: 'LUXURY', basePrice: 250000, bestSeason: 'Winter', maxPeople: 2, description: 'Zurich, Lucerne, Interlaken and Zermatt — skiing, glacier walks and chocolate tours.' },
  { title: 'Maldives Honeymoon Retreat', destination: 'Maldives', durationDays: 6, packageType: 'HONEYMOON', basePrice: 180000, bestSeason: 'All Year', maxPeople: 2, description: 'Overwater villas, private beach dinners, couple\'s spa and snorkelling.' },
  { title: 'Tokyo Cultural Immersion', destination: 'Tokyo, Japan', durationDays: 8, packageType: 'CULTURAL', basePrice: 120000, bestSeason: 'Spring', maxPeople: 2, description: 'Tsukiji market, Shibuya crossing, Kyoto temples and authentic ramen tours.' },
  { title: 'Dubai City & Desert Package', destination: 'Dubai, UAE', durationDays: 6, packageType: 'LUXURY', basePrice: 95000, bestSeason: 'Winter', maxPeople: 4, description: 'Burj Khalifa, Gold Souk, desert dune bashing and Dubai Mall shopping.' },
  { title: 'Paris Art & Cuisine Tour', destination: 'Paris, France', durationDays: 7, packageType: 'CULTURAL', basePrice: 200000, bestSeason: 'Spring', maxPeople: 2, description: 'Louvre and Musee d\'Orsay tours, Seine river cruise and fine-dining bistro crawl.' },
  { title: 'Singapore City Explorer', destination: 'Singapore', durationDays: 5, packageType: 'FAMILY', basePrice: 90000, bestSeason: 'All Year', maxPeople: 4, description: 'Gardens by the Bay, Sentosa Island, Universal Studios and hawker-centre food trails.' },
  { title: 'Bangkok Thailand Adventure', destination: 'Bangkok, Thailand', durationDays: 5, packageType: 'BUDGET', basePrice: 45000, bestSeason: 'Winter', maxPeople: 4, description: 'Grand Palace, floating markets, street food and island day-trips.' },
  { title: 'London Royal Heritage Tour', destination: 'London, UK', durationDays: 6, packageType: 'CULTURAL', basePrice: 160000, bestSeason: 'Summer', maxPeople: 4, description: 'Buckingham Palace, the Tower of London, West End shows and Thames river cruise.' },
  { title: 'Rome Italy Classic Tour', destination: 'Rome, Italy', durationDays: 6, packageType: 'CULTURAL', basePrice: 155000, bestSeason: 'Spring', maxPeople: 4, description: 'Colosseum, Vatican Museums, Trevi Fountain and authentic trattoria dining.' },
  { title: 'Barcelona Spain Getaway', destination: 'Barcelona, Spain', durationDays: 5, packageType: 'CULTURAL', basePrice: 130000, bestSeason: 'Summer', maxPeople: 4, description: 'Sagrada Familia, Park Guell, Gothic Quarter and beachside tapas evenings.' },
  { title: 'Istanbul Turkey Discovery', destination: 'Istanbul, Turkey', durationDays: 5, packageType: 'CULTURAL', basePrice: 110000, bestSeason: 'Autumn', maxPeople: 4, description: 'Hagia Sophia, Blue Mosque, Grand Bazaar and a Bosphorus sunset cruise.' },
  { title: 'New York City Break', destination: 'New York, USA', durationDays: 5, packageType: 'FAMILY', basePrice: 175000, bestSeason: 'Autumn', maxPeople: 4, description: 'Times Square, Central Park, Statue of Liberty and a Broadway show.' },
  { title: 'Amsterdam Netherlands Tour', destination: 'Amsterdam, Netherlands', durationDays: 4, packageType: 'CULTURAL', basePrice: 105000, bestSeason: 'Spring', maxPeople: 4, description: 'Canal cruises, tulip fields, the Van Gogh Museum and cycling tours.' },
  { title: 'Phuket Island Escape', destination: 'Phuket, Thailand', durationDays: 5, packageType: 'RELAXATION', basePrice: 60000, bestSeason: 'Winter', maxPeople: 4, description: 'Phi Phi Islands boat trips, Patong beach and Thai island-hopping snorkel tours.' },
];

function daysFromNow(n) { return new Date(Date.now() + n * 86400000); }

async function main() {
  console.log('Wiping existing trip data...');
  await prisma.trip.deleteMany({});

  const admin = await prisma.user.findUnique({ where: { email: 'admin@globetrotter.dev' } });
  if (!admin) throw new Error('Admin user not found — run prisma/seed.js first.');

  const all = [
    ...gujarat.map((t) => ({ ...t, group: 'gujarat' })),
    ...india.map((t) => ({ ...t, group: 'india' })),
    ...international.map((t) => ({ ...t, group: 'intl' })),
  ];

  console.log(`Creating ${all.length} trips (${gujarat.length} Gujarat, ${india.length} India, ${international.length} international)...`);

  const created = [];
  for (let i = 0; i < all.length; i++) {
    const t = all[i];
    const start = daysFromNow(10 + i * 3);
    const end = daysFromNow(10 + i * 3 + t.durationDays);
    const trip = await prisma.trip.create({
      data: {
        userId: admin.id,
        title: t.title,
        description: t.description,
        startingLocation: t.group === 'intl' ? 'Mumbai, India' : 'Ahmedabad, India',
        destination: t.destination,
        durationDays: t.durationDays,
        packageType: t.packageType,
        basePrice: t.basePrice,
        bestSeason: t.bestSeason,
        coverImage: img(t.title),
        rating: parseFloat((Math.random() * 1.2 + 3.8).toFixed(1)),
        views: Math.floor(Math.random() * 4000) + 200,
        popularity: Math.floor(Math.random() * 40) + 60,
        isTrending: Math.random() > 0.75,
        maxPeople: t.maxPeople,
        startDate: start,
        endDate: end,
        isPublic: true,
        status: 'AVAILABLE',
      },
    });
    created.push(trip);
  }

  console.log('Creating community posts for a sample of trips...');
  const sample = created.filter((_, i) => i % 6 === 0).slice(0, 8);
  for (const t of sample) {
    await prisma.communityShare.create({
      data: {
        tripId: t.id,
        userId: admin.id,
        slug: t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + t.id.slice(0, 6),
        title: t.title,
        description: t.description,
        tags: t.packageType,
        likesCount: Math.floor(Math.random() * 200),
        viewsCount: t.views,
      },
    }).catch(() => {});
  }

  console.log(`Done — ${created.length} trips created.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
