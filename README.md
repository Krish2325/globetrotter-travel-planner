# 🌍 Globetrotter

**A modern, full-stack travel planning platform with a centralized admin console.**
Plan itineraries, track budgets, manage packing lists, and share adventures — all in one place.

<p>
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black">
  <img alt="Express" src="https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white">
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-v3-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="Status" src="https://img.shields.io/badge/status-active-brightgreen">
</p>

![Globetrotter banner](https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Architecture](#-database-architecture)
- [API Overview](#-api-overview)
- [Team](#-team)

---

## 🎯 Overview

Globetrotter simplifies trip planning by centralizing itineraries, budgets, packing lists, and journaling in a clean, modern interface — backed by a role-based **Admin Console** for platform management and analytics.

The stack is built around a hardened Express API (Helmet, strict CORS, request sanitization, and rate limiting), a normalized Prisma data model with indexed hot query paths, and two independent React front ends sharing a consistent **Sunset Coral** design system.

---

## 🚀 Features

### 👤 User Platform (`/frontend`)
- **Intelligent Dashboard** — dynamic greeting, personalized trip recommendations, and stat tracking.
- **Itinerary Builder** — plan multi-city stops, attach activities, and visualize routes on interactive Leaflet maps.
- **Budget Tracker** — visual expense tracking with category breakdowns via Recharts.
- **Travel Utilities** — interactive packing checklists and a rich-text trip journal.
- **Community** — publish itineraries to the public gallery, discover top destinations, and clone other users' trips to your own profile.

### 🛡️ Admin Console (`/admin`)
- **Secure Auth** — strict route guarding, infinite-load prevention, and dedicated admin credentials.
- **Analytics Dashboard** — real-time metrics for user signups, popular destinations, and seasonal trends.
- **User Management** — global overview of all registered users, with activity views, role assignment, and access control.
- **Platform Oversight** — monitor public trips, manage global activities, and oversee community engagement.

### ⚙️ Backend & Data (`/backend`)
- **Hardened APIs** — `helmet` for secure HTTP headers, strict CORS whitelisting, and payload sanitization middleware.
- **Validation** — regex-based email and password-strength checks on every signup path.
- **Performance** — Prisma indexes on every foreign key and hot filter column (`userId`, `isPublic`, `status`, `createdAt`, …) for fast, responsive queries as data grows.
- **Observability** — a `/health` endpoint that pings the database and reports live connection latency and process uptime.
- **Resilience** — graceful shutdown that drains in-flight requests and cleanly closes the database connection pool on `SIGTERM`/`SIGINT`.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite, Framer Motion, Tailwind CSS v3, Lucide-React |
| **Admin Panel** | React, Vite, Recharts (Analytics), Axios Interceptors |
| **Theme** | Sunset Coral palette · Sora (display) + Manrope (body) typography |
| **Backend** | Node.js, Express, Helmet (Security), CORS, Rate Limiting |
| **ORM & DB** | Prisma ORM, SQLite (local dev) / MySQL (production-ready) |
| **Auth** | JWT, bcryptjs, Role-Based Access Control (RBAC) |
| **Maps** | Leaflet.js, OpenStreetMap |
| **Email** | Nodemailer |

---

## 📁 Project Structure

```
globetrotter-travel-planner/
├── backend/            # Express API + Prisma ORM
│   ├── prisma/         # Schema, migrations, seed scripts
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       └── services/
├── frontend/           # Traveler-facing React app (Vite)
│   └── src/
│       ├── pages/
│       ├── components/
│       └── admin/      # Embedded admin views
└── admin/               # Standalone admin console (Vite)
    └── src/
        ├── pages/
        └── layouts/
```

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- *(Optional)* MySQL, if migrating off SQLite for production

### 1. Clone the repository
```bash
git clone https://github.com/Krish2325/globetrotter-travel-planner.git
cd globetrotter-travel-planner
```

### 2. Backend setup (port 5000)
```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Update JWT_SECRET and email credentials in .env

# Initialize the database
npx prisma db push
node prisma/seed.js

# Start the API
npm run dev
```

### 3. User frontend setup (port 5173)
```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

### 4. Admin panel setup (port 5174)
```bash
# In a new terminal
cd admin
npm install
npm run dev
```

---

## 🔐 Environment Variables

Configured in `backend/.env` (see [`backend/.env.example`](./backend/.env.example)):

| Variable | Description |
|---|---|
| `PORT` | Port the API server listens on (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `DATABASE_URL` | Prisma connection string (SQLite file path, or a MySQL URL in production) |
| `JWT_SECRET` | Secret used to sign authentication tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `CLIENT_URL` | Allowed origin(s) for CORS in production |
| `EMAIL_FROM` | Sender address for Nodemailer |
| `EMAIL_PASSWORD` | App password for the sender mailbox |

---

## 🗄 Database Architecture

Globetrotter uses a fully normalized relational schema via Prisma, with indexes on every foreign key and frequently-filtered column to keep queries fast as data scales.

**Core models:** `User`, `Trip`, `City`, `Stop`, `Activity`, `Budget`, `Expense`, `Checklist`, `Note`, `CommunityShare`, `TripCopy`

To migrate to MySQL for production, update `DATABASE_URL` in `.env` to your MySQL connection string and re-run `npx prisma db push`.

---

## 🔌 API Overview

All routes are mounted under `/api` (see [`backend/src/app.js`](./backend/src/app.js)):

| Route | Resource |
|---|---|
| `/api/auth` | Authentication & email verification |
| `/api/users` | User profiles |
| `/api/trips` | Trip CRUD & itineraries |
| `/api/stops` | Itinerary stops |
| `/api/activities` | Activity discovery |
| `/api/cities` | City discovery |
| `/api/budgets` | Trip budgets |
| `/api/expenses` | Expense tracking |
| `/api/checklists` | Packing checklists |
| `/api/notes` | Trip journal notes |
| `/api/community` | Public sharing & community gallery |
| `/api/analytics` | Admin analytics |

`GET /health` reports API and database status, including live round-trip latency.

---

## 👥 Team

| Contributor | Focus Area |
|---|---|
| [Krish2325](https://github.com/Krish2325) | Project owner & maintainer |
| [DharmTrivedi](https://github.com/DharmTrivedi) | Backend & database management |
| [Jeelpatel-48](https://github.com/Jeelpatel-48) | Full-stack (frontend, backend, admin) |
| [Areen82](https://github.com/Areen82) | Backend |

---

<p align="center">Built with ❤️ for travelers who love to plan.</p>
