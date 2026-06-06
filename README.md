# Ikonex Academy — Student Management System

A complete, enterprise-grade Student Management System built for Ikonex Academy.

## Features

- **RBAC Authentication**: Secure JWT-based roles (SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, CLASS_TEACHER).
- **Assessment Console**: Spreadsheet-style high-performance grid for score entry with debouncing and bulk-save commits.
- **Results Engine**: Advanced `GradingEngine` implementation that automatically calculates totals, grades students based on custom 11-scale configuration, and assigns accurate dense ranks for both subjects and overall class positions.
- **Report Generation**: PDF generation via `pdfkit` featuring school letterheads, QR codes, and performance summaries.
- **Dashboard Analytics**: Deep analytical insights with Recharts covering performance trends and grade distributions.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS (v4), Framer Motion, TanStack Query, Zustand, Recharts.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PDFKit.
- **Database**: PostgreSQL
- **DevOps**: Docker, Docker Compose, GitHub Actions.

## Getting Started

### Prerequisites

- Node.js (v20+)
- Docker & Docker Compose (optional, for local DB)

### Installation

1. Install dependencies for the entire monorepo:
   ```bash
   npm install
   ```

2. Start the Postgres Database using Docker Compose:
   ```bash
   docker-compose up db -d
   ```

3. Setup the Database and Seed Data:
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   cd ..
   ```

### Running the Application Locally

Run both the frontend and backend development servers concurrently:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:5000`.

### Initial Credentials

The database is seeded with a default Super Admin account:
- **Email**: `admin@ikonex.com`
- **Password**: `password123`

## Architecture

The project is structured as an npm workspace monorepo:
- `/frontend` - Vite React App
- `/backend` - Express API with Prisma
