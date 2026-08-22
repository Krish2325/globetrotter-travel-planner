# Globetrotter 🌍

> A modern, full-stack travel planning platform and centralized admin console built with React, Node.js, Express, and Prisma.

![Globetrotter](https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80)

## 📸 Screenshots

### 👤 User Platform

| Login | Dashboard |
|-------|-----------|
| ![Login](./screenshots/01_login.png) | ![Dashboard](./screenshots/02_dashboard.png) |

| My Trips | Profile |
|----------|---------|
| ![My Trips](./screenshots/03_my_trips.png) | ![Profile](./screenshots/04_profile.png) |

---

### 🛡️ Admin Console

| Admin Login | Admin Dashboard |
|-------------|-----------------|
| ![Admin Login](./screenshots/05_admin_login.png) | ![Admin Dashboard](./screenshots/06_admin_dashboard.png) |

| Analytics | Manage Trips |
|-----------|-------------|
| ![Analytics](./screenshots/07_admin_analytics.png) | ![Manage Trips](./screenshots/08_admin_manage_trips.png) |

| Trip Packages | Checklists |
|---------------|-----------|
| ![Trip Packages](./screenshots/09_admin_trip_packages.png) | ![Checklists](./screenshots/10_admin_checklists.png) |

| User Management | Reports & Insights |
|-----------------|-------------------|
| ![User Management](./screenshots/11_admin_users.png) | ![Reports](./screenshots/12_admin_reports.png) |

| Admin Profile | Settings |
|---------------|---------|
| ![Admin Profile](./screenshots/13_admin_profile.png) | ![Settings](./screenshots/14_admin_settings.png) |

---

## 🎯 Project Overview
Globetrotter simplifies trip planning by centralizing itineraries, budgets, packing lists, and journaling in a beautifully designed, modern interface. It also includes a robust, role-based **Admin Console** for platform management and analytics. 

Recently updated to feature enterprise-grade security headers, robust request validation, and an overhauled UI utilizing clean typography and Lucide-React iconography.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite, Framer Motion, Tailwind CSS v3, Lucide-React |
| **Admin Panel** | React, Vite, Recharts (Analytics), Axios Interceptors |
| **Theme** | Sunset Coral palette, Sora (display) + Manrope (body) typography |
| **Backend** | Node.js, Express, Helmet (Security), CORS, Rate Limiting |
| **ORM & DB** | Prisma ORM, SQLite (Local Dev) / MySQL (Production Ready) |
| **Auth** | JWT (JSON Web Tokens), bcryptjs, Role-Based Access Control (RBAC) |
| **Maps** | Leaflet.js, OpenStreetMap |
| **Email** | Nodemailer |

---

## 🚀 Features

### User Platform (`/frontend`)
*   **Intelligent Dashboard:** Dynamic greeting, personalized trip recommendations, and stat tracking.
*   **Itinerary Builder:** Plan multi-city stops, attach activities, and visualize routes on interactive Leaflet maps.
*   **Budget Tracker:** Visual expense tracking with category breakdowns via Recharts.
*   **Travel Utilities:** Interactive packing checklists and a rich-text trip journal.
*   **Community:** Publish itineraries to the public gallery, discover top destinations, and seamlessly clone other users' trips to your profile.

### Admin Console (`/admin`)
*   **Secure Auth:** Strict route guarding, infinite-load prevention, and dedicated admin credentials.
*   **Analytics Dashboard:** Real-time metrics visualization including user signups, popular destinations, and seasonal trends.
*   **User Management:** Global overview of all registered users with abilities to view activity, assign roles, and manage access.
*   **Platform Oversight:** Monitor public trips, manage global activities, and oversee community engagement.

### Backend Security (`/backend`)
*   **Hardened APIs:** Configured `helmet` for secure HTTP headers and cross-origin policies.
*   **Strict CORS:** Whitelisted domains to prevent cross-site request forgery.
*   **Sanitization:** Custom middleware to trim and sanitize incoming request payloads.
*   **Validation:** Robust regex-based validation for emails and password strength on user and admin signups.

---

## 💻 Getting Started

### Prerequisites
*   Node.js 18+
*   NPM or Yarn
*   *(Optional)* MySQL if migrating from SQLite.

### 1. Repository Setup
```bash
git clone https://github.com/dev-jeelpatel/globetrotter-odoo-hackathon.git
cd globetrotter-odoo-hackathon
```

### 2. Backend Initialization (Port 5000)
```bash
cd backend
npm install

# Configure Environment
cp .env.example .env
# Important: Update JWT_SECRET and SMTP details in .env

# Initialize Database
npx prisma db push
node prisma/seed.js

# Start Development Server
npm run dev
```

### 3. User Frontend Initialization (Port 5173)
```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

### 4. Admin Panel Initialization (Port 5174)
```bash
# In a new terminal
cd admin
npm install
npm run dev
```

---

## 🗄 Database Architecture

Globetrotter features a fully normalized relational database schema via Prisma.
Key models include: `User`, `Trip`, `City`, `Stop`, `Activity`, `Budget`, `Expense`, `Checklist`, `Note`, and `CommunityShare`.

*(To migrate to MySQL for production, simply update the `DATABASE_URL` inside `.env` to your MySQL connection string and re-run `npx prisma db push`)*.

---
