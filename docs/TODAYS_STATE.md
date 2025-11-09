# Today's State - Health Check Summary

**Date:** 2024-12-19  
**Staff Engineer + QA Lead Audit**

## 📊 Repository Structure

### Pages & Routes
- ✅ `/` (Financial dashboard) - **ACTIVE**
- ✅ `/plan` - Plan view with monthly table
- ✅ `/revenue` - Revenue forecast page
- ✅ `/business` - SaaS Metrics dashboard
- ✅ `/people` - People & Payroll management
- ✅ `/expenses` - Expenses page (placeholder)
- ⚠️ `/login`, `/signup` - Exist but may be unused (no auth in MVP)
- ⚠️ `/(dashboard)/scenarios/*` - Legacy routes (may be unused)

### Calculation Engine
- ✅ `src/lib/calc/plan.ts` - Main `buildPlan()` function
- ✅ `src/lib/calc/types.ts` - Type definitions (Assumptions, MonthRow, PlanSummary)
- ❌ Tests reference non-existent modules: `cash`, `people`, `topline`, `drivers`

### State Management
- ✅ `src/state/store.ts` - Zustand store with default assumptions
- ✅ Store initialized with defaults (2.4M ARR, 6K ACV, etc.)

### Components
- ✅ `Tooltip` - CSS-only tooltip with accessibility
- ✅ `KpiCard` - Dashboard KPI cards with tooltips
- ✅ `Sidebar` - Navigation with search (Ctrl+K)
- ✅ Chart components (Recharts integration)
- ⚠️ Some components may be unused (check dials/, plan/, tiles/)

### Key Features Implemented
1. **Financial Dashboard** (`/`)
   - 10 KPI cards (Revenue, COGS, Gross Margin, Operating Cost, EBITDA, Magic Number, Burn Multiple, Rule of 40, Gross Margin %, Operating Margin %)
   - All KPIs have tooltips with explanations
   - Removed Cash Burn and Cash Runway graphs (as requested)

2. **Revenue Forecast** (`/revenue`)
   - Multi-channel revenue modeling (PLG, Sales, Partners)
   - 24-month forecast
   - Integration with store (syncs starting MRR)
   - Chart and monthly table

3. **Plan View** (`/plan`)
   - Monthly forecast table
   - ARR & Revenue chart
   - Cash vs Collections & Spend chart

4. **SaaS Metrics** (`/business`)
   - Comprehensive SaaS KPIs (LTV, CAC, NRR, retention, growth, efficiency)
   - Monthly forecast table

5. **People** (`/people`)
   - Department subsections (Customer Success, Support, Sales, Marketing, BD, R&D, G&A)
   - Headcount and payroll tracking

## 🔴 Critical Issues

### 1. Broken Tests
- All 4 test files fail: `plan.test.ts`, `topline.test.ts`, `people.test.ts`, `cash.test.ts`
- Tests reference non-existent modules
- `plan.test.ts` expects `summary.nrrPct` and `summary.ltv` which don't exist in `PlanSummary`

### 2. Missing TypeScript Script
- No `typecheck` script in package.json
- Should run `tsc --noEmit` for CI

### 3. No E2E Tests
- No Playwright setup
- No smoke tests for critical routes

### 4. No CI/CD
- No GitHub Actions workflow
- No automated testing on PRs

### 5. Accessibility
- No accessibility linting configured
- Need to audit ARIA labels, keyboard navigation

### 6. Performance
- No performance linting
- No bundle size analysis

## 🟡 Medium Priority Issues

1. **Unused Routes/Components**
   - Legacy dashboard routes (`/(dashboard)/scenarios/*`)
   - Auth routes (`/login`, `/signup`) - not needed for MVP
   - Some component directories may be empty/unused

2. **Test Coverage**
   - Only calc layer has tests (but they're broken)
   - No component tests
   - No integration tests

3. **Documentation**
   - README is outdated (talks about Node.js server, not Next.js app)
   - No API documentation
   - No component documentation

## ✅ What's Working

1. **Build System**
   - Next.js 16 with App Router
   - TypeScript configured
   - Tailwind CSS 4
   - Build succeeds

2. **Core Functionality**
   - Calculation engine (`buildPlan`) works
   - State management (Zustand) works
   - All main pages render
   - Charts render (Recharts)

3. **UI/UX**
   - Responsive design
   - Tooltips with good UX
   - Professional styling
   - Currency formatting

## 📝 Next Steps

1. Fix broken tests
2. Add typecheck script
3. Set up Playwright for E2E tests
4. Create GitHub Actions workflow
5. Add accessibility linting
6. Create Q&A.md with unresolved assumptions
7. Create RELEASE-CHECKLIST.md


