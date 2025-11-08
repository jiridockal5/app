# RFC-0001: SaaS Budget Tool MVP

## Problem

Non-finance founders struggle to make a 12-18 month plan without drowning in accounting complexity.

## Vision (MVP)

Five dials and two editors produce a clean 12-month plan:
- **Dials**: New customers, Price (ACV), Churn %, Upsell %, Tools/Ads budget
- **Editors**: People (counts × avg cost) and Spend (5 simple buckets)
- **Output**: Revenue, Costs, Cash/Runway, and 6 KPIs on one page

## Non-Goals for MVP

- No permissions/teams
- No multi-currency line items
- No GAAP detail
- No actuals import
- No tax/BS

## Time Horizon

12 months forecast (MVP)

## Currency

Single base currency in MVP (USD or CZK). Default USD; allow CZK→USD via one FX input.

## Personas & Jobs-to-be-Done

### Founder (primary)
- Wants to see runway months
- Feel the effect of changing 3-5 drivers
- Share a one-pager

### CSO/CMO/CTO (support)
- Provide realistic inputs for logos/month, pricing, churn/upsell, headcount and tools/ads

### Key Jobs
1. "Tell me how many months of runway we have."
2. "If I delay a hire or raise price, what happens to cash and ARR?"
3. "Give me a simple PDF/CSV I can send to the team."

## UX Scope

### A) Setup Wizard (10-12 inputs, 5-7 minutes)
1. Starting ARR (USD)
2. ACV (avg annual price per customer)
3. New customers per month
4. Monthly churn % (logos)
5. Monthly upsell/price uplift %
6. Starting cash
7. Team sizes today by function (R&D, Sales, Marketing, CS, Ops)
8. Planned hires next 6 months (count only)
9. Average total cost per person (per function)
10. Tools/Ads/Infra budget per month (rough total)
11. Optional: FX CZK→USD
12. Optional: one-off investment (month & amount)

### B) Dials (live)
- New customers / month
- ACV
- Churn % / month
- Upsell % / month
- Tools/Ads per month
- (Optional slider) FX CZK→USD

### C) People & Spend editors
- **People**: counts by function + avg cost → payroll
- **Spend**: 5 buckets per team (Tools, Ads, Events, Freelancers, Other); totals OK for MVP

### D) Plan (one page)
- **Tiles**: ARR (year), Revenue/mo, Burn/mo, Cash runway (months), NRR, LTV/CAC
- **Charts**: (1) ARR & Revenue line; (2) Cash, Collections & Spend area
- **Table**: Month, New logos, ARR end, Revenue, Collections, Spend, Burn, Cash

## Driver Model & Formulas

### Topline
- `NewARR_t = NewLogos_t * ACV`
- `ChurnARR_t = OpeningARR_t * churn_m`
- `UpsellARR_t = OpeningARR_t * upsell_m`
- `ClosingARR_t = OpeningARR_t + NewARR_t - ChurnARR_t + UpsellARR_t`
- `Revenue_t ≈ ClosingARR_t / 12`

### Collections (timing proxy)
- `Collections_t = Revenue_t * 0.25 + Revenue_{t-1} * 0.75` (expose as editable split)

### People cost (USD)
- `Payroll_t = Σ(teamHeadcount_t * avgCostTeamUSD)`
- MVP headcount progression: current plus planned hires spread over next 6 months

### Opex (USD)
- `Opex_t = Σ(teamSpendBuckets_t)`

### Cash
- `Cash_t = Cash_{t-1} + Collections_t - (Payroll_t + Opex_t) + Investment_t`

### KPIs
- `NRR_proxy = 1 - churn_m + upsell_m` (display as %)
- `CAC_t = (SalesSpend_t + MarketingSpend_t) / max(1, NewLogos_t)`
- `LTV = (ACV/12) / churn_m`
- `LTV_CAC = LTV / CAC_t` (if CAC_t = 0, display "–")
- `Burn_t = Payroll_t + Opex_t - Collections_t`
- `RunwayMonths = Cash_{current} / max(1, Burn_next_month)` (∞ if Burn ≤ 0)

### Defaults
- `churn_m = 0.008`
- `upsell_m = 0.003`
- `collectSplit = [0.25, 0.75]`

## Architecture

### Stack
- Next.js (App Router) + TypeScript + Tailwind
- Zustand (state)
- Recharts (charts)
- Vitest (testing)

### Data
- Client-side state
- Persist to localStorage for scenarios
- DB later

## Labeling (avoid jargon)

- ARR → "Annual subscriptions total"
- ACV → "Average price per customer (per year)"
- Churn → "Customers lost each month"
- Upsell → "Average price increase per month"
- Runway → "Months until cash would reach zero"

## Definition of Done

- All calc functions covered by tests (≥80% lines)
- Changing any input updates plan <100ms
- No console errors, no TS any, accessible labels, mobile-friendly
- Bundle size reasonable; lighthouse perf ≥ 90 on desktop

