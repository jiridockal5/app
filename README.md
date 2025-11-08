# SaaS Budget Tool

A non-finance-friendly budgeting tool for B2B SaaS companies. Turn plain-English inputs into a simple plan showing Revenue, Spend, Cash/Runway and KPIs.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Recharts (charts)
- Vitest (testing)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

3. Run tests:
```bash
npm test
```

## Project Structure

- `src/app/` - Next.js App Router pages
- `src/components/` - React components
- `src/lib/calc/` - Calculation engine (pure functions)
- `src/state/` - Zustand state management
- `tests/` - Unit tests

## Features

- ✅ Complete calculation engine with all formulas
- ✅ Plan page with KPIs, charts, and monthly table
- ✅ Client-side only (no backend required)
- ✅ Type-safe TypeScript implementation
- ✅ Unit tests for core functions

## Deployment

This is a client-side only application that can be deployed to Vercel without any environment variables or database setup.

```bash
npm run build
```

The build output can be deployed to Vercel, Netlify, or any static hosting service.

