/**
 * Personal (user-side) demo data — run with: node prisma/seed-demo-user-trips.js
 * Populates the demo user's own account with real trips + itinerary stops,
 * budgets, expenses, checklists and notes, so My Trips / Itinerary / Budget /
 * Checklists / Notes / Community all have content when logged in as a
 * regular user (demo@globetrotter.dev). Does not touch admin-owned trip
 * packages or the City/Activity catalog.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TRIPS = [
  {
    title: 'Goa Beach Weekend',
    description: 'A relaxed long weekend with friends — beaches, seafood and sunset cruises.',
    startingLocation: 'Mumbai, India',
    destination: 'Goa, India',
    cityName: 'Goa',
    status: 'COMPLETED',
    isPublic: true,
    startDate: new Date('2026-06-10'),
    endDate: new Date('2026-06-14'),
    budget: { totalBudget: 24000, accommodation: 8000, food: 6000, transport: 4000, activities: 4000, shopping: 1500, miscellaneous: 500 },
    expenses: [
      { title: 'Flights Mumbai-Goa', amount: 6200, category: 'TRANSPORT', daysIn: 0 },
      { title: 'Beach resort (3 nights)', amount: 8400, category: 'ACCOMMODATION', daysIn: 0 },
      { title: 'Seafood dinners', amount: 3100, category: 'FOOD', daysIn: 1 },
      { title: 'Water sports', amount: 2200, category: 'ACTIVITIES', daysIn: 2 },
      { title: 'Souvenirs', amount: 900, category: 'SHOPPING', daysIn: 3 },
    ],
    checklist: { title: 'Packing List', allChecked: true, items: ['Swimwear', 'Sunscreen', 'Flip-flops', 'Sunglasses', 'Beach towel', 'ID proof'] },
    note: { title: 'Trip memories', content: 'Sunset at Candolim was unreal. Must go back for the Dudhsagar trek next time — ran out of days!' },
  },
  {
    title: 'Manali Adventure Trip',
    description: 'River rafting, mountain views and a bonfire night with the whole gang.',
    startingLocation: 'Delhi, India',
    destination: 'Manali, India',
    cityName: 'Manali',
    status: 'CONFIRMED',
    isPublic: false,
    startDate: new Date('2026-09-15'),
    endDate: new Date('2026-09-20'),
    budget: { totalBudget: 32000, accommodation: 10000, food: 6000, transport: 8000, activities: 6000, shopping: 1000, miscellaneous: 1000 },
    expenses: [
      { title: 'Volvo bus tickets', amount: 3800, category: 'TRANSPORT', daysIn: 0 },
      { title: 'Hotel advance payment', amount: 5000, category: 'ACCOMMODATION', daysIn: 0 },
    ],
    checklist: { title: 'Packing List', allChecked: false, items: ['Warm jacket', 'Trekking shoes', 'Woolen cap', 'Power bank', 'Rain cover', 'First-aid kit'], checkedCount: 3 },
    note: null,
  },
  {
    title: 'Kerala Backwaters Escape',
    description: 'Slow travel through the backwaters — still finalizing the houseboat and homestay dates.',
    startingLocation: 'Bangalore, India',
    destination: 'Kerala, India',
    cityName: 'Kerala',
    status: 'PLANNING',
    isPublic: false,
    startDate: new Date('2026-12-05'),
    endDate: new Date('2026-12-09'),
    budget: null,
    expenses: [],
    checklist: { title: 'Things to research', allChecked: false, items: ['Compare houseboat operators', 'Check monsoon backup dates', 'Ayurveda spa bookings'], checkedCount: 0 },
    note: { title: 'Ideas', content: 'Ask Priya for the homestay contact she used last year near Alleppey.' },
  },
];

async function main() {
  const demo = await prisma.user.findUnique({ where: { email: 'demo@globetrotter.dev' } });
  if (!demo) throw new Error('Demo user not found — run prisma/seed.js first.');

  console.log('Clearing existing demo-user trips...');
  await prisma.trip.deleteMany({ where: { userId: demo.id } });

  for (const t of TRIPS) {
    const city = await prisma.city.findFirst({ where: { name: t.cityName } });
    if (!city) { console.log(`Skipping stops for ${t.title} — city "${t.cityName}" not found`); }

    const trip = await prisma.trip.create({
      data: {
        userId: demo.id,
        title: t.title,
        description: t.description,
        startingLocation: t.startingLocation,
        destination: t.destination,
        durationDays: Math.round((t.endDate - t.startDate) / 86400000) + 1,
        coverImage: `https://picsum.photos/seed/${encodeURIComponent(t.title)}/800/600`,
        startDate: t.startDate,
        endDate: t.endDate,
        isPublic: t.isPublic,
        status: t.status,
      },
    });
    console.log(`Created trip: ${t.title}`);

    if (city) {
      const activities = await prisma.activity.findMany({ where: { cityId: city.id }, take: 3 });
      const stop1 = await prisma.stop.create({
        data: { tripId: trip.id, cityId: city.id, dayNumber: 1, order: 0, notes: 'Arrival & check-in' },
      });
      for (const a of activities.slice(0, 2)) {
        await prisma.stopActivity.create({ data: { stopId: stop1.id, activityId: a.id, order: 0 } }).catch(() => {});
      }
      await prisma.stop.create({
        data: { tripId: trip.id, cityId: city.id, dayNumber: t.durationDays > 2 ? 3 : 2, order: 1, notes: 'Local exploring' },
      });
    }

    if (t.budget) {
      await prisma.budget.create({ data: { tripId: trip.id, ...t.budget } });
    }

    for (const e of t.expenses) {
      await prisma.expense.create({
        data: {
          tripId: trip.id, title: e.title, amount: e.amount, category: e.category,
          date: new Date(t.startDate.getTime() + e.daysIn * 86400000),
        },
      });
    }

    if (t.checklist) {
      const cl = await prisma.checklist.create({
        data: { tripId: trip.id, userId: demo.id, title: t.checklist.title, category: 'PACKING' },
      });
      const checkedCount = t.checklist.allChecked ? t.checklist.items.length : (t.checklist.checkedCount || 0);
      for (let i = 0; i < t.checklist.items.length; i++) {
        await prisma.checklistItem.create({
          data: { checklistId: cl.id, label: t.checklist.items[i], order: i, isChecked: i < checkedCount },
        });
      }
    }

    if (t.note) {
      await prisma.note.create({ data: { tripId: trip.id, userId: demo.id, title: t.note.title, content: t.note.content } });
    }

    if (t.isPublic) {
      await prisma.communityShare.create({
        data: {
          tripId: trip.id, userId: demo.id,
          slug: t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + trip.id.slice(0, 6),
          title: t.title, description: t.description, tags: 'PERSONAL',
          likesCount: Math.floor(Math.random() * 40), viewsCount: Math.floor(Math.random() * 300),
        },
      }).catch(() => {});
    }
  }

  console.log(`Done — ${TRIPS.length} personal trips created for demo user.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
