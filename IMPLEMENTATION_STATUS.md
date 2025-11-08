# Implementation Status

## ✅ Completed

### Core Infrastructure
- ✅ RFC-0001-mvp.md specification document
- ✅ Project scaffold (Next.js 16, TypeScript, Tailwind, Zustand, Vitest)
- ✅ Type definitions (`lib/calc/drivers.ts`) with default assumptions
- ✅ Zustand store (`state/store.ts`) for assumptions management

### Calculation Functions
- ✅ `lib/calc/topline.ts` - ARR and revenue calculations
- ✅ `lib/calc/cash.ts` - Collections and cash roll
- ✅ `lib/calc/people.ts` - Headcount progression and payroll
- ✅ `lib/calc/spend.ts` - Spend bucket aggregation
- ✅ `lib/calc/kpis.ts` - NRR, CAC, LTV, runway, burn
- ✅ `lib/calc/plan.ts` - Plan orchestrator

### Unit Tests
- ✅ `tests/lib/calc/topline.test.ts`
- ✅ `tests/lib/calc/cash.test.ts`
- ✅ `tests/lib/calc/people.test.ts`
- ✅ `tests/lib/calc/plan.test.ts`

### UI Components
- ✅ Input components: `Num.tsx`, `Money.tsx`, `Pct.tsx`, `Slider.tsx`
- ✅ `KpiTile.tsx` - KPI display with warnings
- ✅ `ArrRevenueChart.tsx` - ARR & Revenue line chart
- ✅ `CashChart.tsx` - Cash, Collections & Spend area chart
- ✅ `MonthlyTable.tsx` - 12-row monthly table

### Pages
- ✅ `/plan` - Plan summary page with KPIs, charts, and table
- ✅ Root page redirects to `/plan`

## 🚧 Remaining Tasks

### Pages
- ⏳ `/wizard` - Setup wizard (10-12 inputs)
- ⏳ `/dials` - Live dials editor
- ⏳ `/people` - People editor (counts × avg cost)
- ⏳ `/spend` - Spend editor (5 buckets per team)

### Features
- ⏳ LocalStorage persistence for scenarios
- ⏳ CSV export of monthly table
- ⏳ PDF export (simple client print)
- ⏳ Guardrails (heatbars, warnings)
- ⏳ Navigation between pages

### Testing
- ⏳ More comprehensive unit tests
- ⏳ Integration tests
- ⏳ Component tests

## Current State

The scaffold is functional with:
- ✅ Complete calculation engine with all formulas
- ✅ Working plan page displaying KPIs, charts, and table
- ✅ Default assumptions producing valid 12-month forecast
- ✅ Type-safe implementation with strict TypeScript
- ✅ Basic unit tests for core functions

## Next Steps

1. Create wizard page for initial setup
2. Create dials page for live adjustments
3. Create people and spend editors
4. Add localStorage persistence
5. Add export functionality
6. Add guardrails and warnings
7. Improve test coverage

## Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Testing

Run tests with:
```bash
npm test
```

Tests are located in `tests/lib/calc/` and cover the core calculation functions.

