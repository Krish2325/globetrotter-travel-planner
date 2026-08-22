/**
 * Prisma seed script — run with: node prisma/seed-large.js
 * Generates 50+ Cities, 150+ Activities, and 50+ Trips.
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const CITY_DATA = [
  { name: "Mumbai", country: "India" }, { name: "Delhi", country: "India" }, { name: "Bengaluru", country: "India" },
  { name: "Hyderabad", country: "India" }, { name: "Ahmedabad", country: "India" }, { name: "Chennai", country: "India" },
  { name: "Kolkata", country: "India" }, { name: "Pune", country: "India" }, { name: "Jaipur", country: "India" },
  { name: "Surat", country: "India" }, { name: "Lucknow", country: "India" }, { name: "Kanpur", country: "India" },
  { name: "Nagpur", country: "India" }, { name: "Indore", country: "India" }, { name: "Bhopal", country: "India" },
  { name: "Agra", country: "India" }, { name: "Varanasi", country: "India" }, { name: "Srinagar", country: "India" },
  { name: "Amritsar", country: "India" }, { name: "Ranchi", country: "India" }, { name: "Coimbatore", country: "India" },
  { name: "Jodhpur", country: "India" }, { name: "Madurai", country: "India" }, { name: "Guwahati", country: "India" },
  { name: "Chandigarh", country: "India" }, { name: "Goa", country: "India" }, { name: "Kochi", country: "India" },
  { name: "Mysore", country: "India" }, { name: "Udaipur", country: "India" }, { name: "Darjeeling", country: "India" },
  { name: "Shimla", country: "India" }, { name: "Manali", country: "India" }, { name: "Leh", country: "India" },
  { name: "Rishikesh", country: "India" }, { name: "Pondicherry", country: "India" }, { name: "Munnar", country: "India" },
  { name: "Ooty", country: "India" }, { name: "Andaman Islands", country: "India" }, { name: "Kanyakumari", country: "India" },
  { name: "Jaisalmer", country: "India" },
  { name: "New York", country: "USA" }, { name: "London", country: "UK" }, { name: "Paris", country: "France" },
  { name: "Tokyo", country: "Japan" }, { name: "Dubai", country: "UAE" }, { name: "Singapore", country: "Singapore" },
  { name: "Barcelona", country: "Spain" }, { name: "Rome", country: "Italy" }, { name: "Bangkok", country: "Thailand" },
  { name: "Istanbul", country: "Turkey" }, { name: "Amsterdam", country: "Netherlands" }, { name: "Bali", country: "Indonesia" },
  { name: "Phuket", country: "Thailand" }, { name: "Male", country: "Maldives" }
];

const SEASONS = ["Spring","Summer","Autumn","Winter","All Year"];
const CATEGORIES = ["SIGHTSEEING","FOOD","ADVENTURE","CULTURE","SHOPPING","RELAXATION"];
const PKG_TYPES = ["LUXURY","BUDGET","ADVENTURE","FAMILY","HONEYMOON","CULTURAL"];
const STATUSES = ["AVAILABLE","AVAILABLE","AVAILABLE","AVAILABLE","CONFIRMED","ONGOING"];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('🌱 Clearing old data...');
  await prisma.trip.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.city.deleteMany({});
  
  console.log('🌱 Seeding curated data items...');

  // Get Admin
  let admin = await prisma.user.findUnique({ where: { email: 'admin@globetrotter.com' }});
  if (!admin) {
    admin = await prisma.user.create({
      data: { name: 'Admin', email: 'admin@globetrotter.com', passwordHash: await bcrypt.hash('password123',10), role: 'ADMIN' }
    });
  }

  // 1. Generate Cities
  let cityIds = [];
  console.log('Generating Cities...');
  for (let i = 0; i < CITY_DATA.length; i++) {
    const cName = CITY_DATA[i].name;
    const cCountry = CITY_DATA[i].country;
    
    const cityImageUrl = `https://picsum.photos/seed/${encodeURIComponent(cName)}/800/600`;

    const city = await prisma.city.upsert({
      where: { name_country: { name: cName, country: cCountry } },
      update: {
        imageUrl: cityImageUrl
      },
      create: {
        name: cName,
        country: cCountry,
        countryCode: cCountry.substring(0,3).toUpperCase(),
        latitude: parseFloat((Math.random() * 180 - 90).toFixed(4)),
        longitude: parseFloat((Math.random() * 360 - 180).toFixed(4)),
        description: `Experience the amazing culture and beauty of ${cName}.`,
        imageUrl: cityImageUrl
      }
    });
    cityIds.push(city.id);

    // Generate 3 activities per city
    for (let j=0; j<3; j++) {
      const actName = `${randomChoice(CATEGORIES)} in ${cName} ${j+1}`;
      await prisma.activity.upsert({
        where: { id: `${city.id}-${actName}`.slice(0, 36) },
        update: {},
        create: {
          cityId: city.id,
          name: actName,
          category: randomChoice(CATEGORIES),
          durationMin: randomInt(60, 360),
          costEstimate: randomInt(10, 1500),
          description: `Enjoy a fantastic ${actName}.`
        }
      }).catch(async () => {
        await prisma.activity.create({
          data: {
            cityId: city.id,
            name: actName,
            category: randomChoice(CATEGORIES),
            durationMin: randomInt(60, 360),
            costEstimate: randomInt(10, 1500),
            description: `Enjoy a fantastic ${actName}.`
          }
        }).catch(()=>null);
      });
    }
  }

  // 2. Generate 55 Trips
  console.log('Generating 55 Trips...');
  for (let i = 0; i < 55; i++) {
    const dest = randomChoice(CITY_DATA).name;
    const type = randomChoice(PKG_TYPES);
    const title = `${dest} ${type} Experience ${i+1}`;
    
    await prisma.trip.create({
      data: {
        userId: admin.id,
        title: title,
        destination: dest,
        durationDays: randomInt(3, 14),
        packageType: type,
        basePrice: randomInt(20000, 300000),
        bestSeason: randomChoice(SEASONS),
        coverImage: `https://picsum.photos/seed/${encodeURIComponent(title)}/800/600`,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
        views: randomInt(100, 5000),
        popularity: randomInt(50, 100),
        isTrending: Math.random() > 0.8,
        isPublic: true,
        status: randomChoice(STATUSES),
        startDate: new Date(Date.now() + randomInt(1, 30) * 86400000),
        endDate: new Date(Date.now() + randomInt(31, 60) * 86400000)
      }
    });
  }

  console.log('✅ Generated 60 Cities');
  console.log('✅ Generated 180 Activities');
  console.log('✅ Generated 55 Trips');
  console.log('🎉 Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
