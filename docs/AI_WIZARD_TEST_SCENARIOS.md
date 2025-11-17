# AI Budget Wizard - Test Scenarios

This document contains test scenarios for the AI Budget Wizard to ensure it generates realistic and appropriate budget assumptions.

## Test Scenarios

### Scenario 1: Fundraising for Team Expansion
**User Input:**
> "We want to raise $1M USD to invest into GTM and product team"

**Expected Output:**
- `startCashUsd`: ~$1,000,000 (includes the raise)
- `payrollPerMonthUsd`: ~$80,000-120,000 (6-10 people mixed GTM/engineering)
- `opexPerMonthUsd`: ~$20,000-30,000 (20-25% of payroll)
- `newLogosPerMonth`: 10-20 (with GTM team)
- `churnMonthly`: 0.8-1.5%
- `upsellMonthly`: 0.3-0.5%
- `acvUsd`: $8,000-15,000
- `startArrUsd`: Could be $0 (pre-revenue) or existing ARR if mentioned
- `oneOffInvestmentMonth`: 1-2 (raise happens early)
- `oneOffInvestmentAmountUsd`: $1,000,000

**Reasoning Should Include:**
- Team composition (e.g., 5 engineers + 3 sales + 2 marketing)
- Runway calculation (e.g., "~10 months runway")
- Why these assumptions make sense

---

### Scenario 2: Growth Stage Scaling
**User Input:**
> "We have $500k ARR, want to double in 12 months with 5 engineers and 3 sales reps"

**Expected Output:**
- `startArrUsd`: $500,000
- `payrollPerMonthUsd`: ~$100,000-120,000 (8 people)
- `opexPerMonthUsd`: ~$25,000-35,000
- `newLogosPerMonth`: 15-25 (to support doubling)
- `churnMonthly`: 0.8-1.2%
- `upsellMonthly`: 0.5-0.8%
- `acvUsd`: ~$8,000-12,000 (calculated from ARR and customer base)
- `startCashUsd`: $300,000-500,000 (reasonable for this stage)

**Reasoning Should Include:**
- How many new customers needed to double ARR
- Monthly burn rate
- Whether additional funding needed

---

### Scenario 3: Pre-Revenue Startup
**User Input:**
> "Pre-revenue startup, need to hire 4 engineers and 2 salespeople, plan to close first customers in month 3"

**Expected Output:**
- `startArrUsd`: $0
- `payrollPerMonthUsd`: ~$70,000-90,000 (6 people)
- `opexPerMonthUsd`: ~$15,000-25,000
- `newLogosPerMonth`: 0 for first 2 months, then 5-10 starting month 3
- `churnMonthly`: 1.5-2.5% (higher for early stage)
- `upsellMonthly`: 0.2-0.4% (lower early on)
- `acvUsd`: $6,000-12,000
- `startCashUsd`: $500,000-1,000,000 (needs seed funding)
- `oneOffInvestmentMonth`: 1 (likely has some funding)

**Reasoning Should Include:**
- Ramp up timeline for first customers
- Burn rate and runway needed
- Typical seed funding amount

---

### Scenario 4: Runway Extension Mode
**User Input:**
> "$2M ARR, low churn, want to understand runway with current burn of $150k/month"

**Expected Output:**
- `startArrUsd`: $2,000,000
- `payrollPerMonthUsd`: ~$110,000-130,000
- `opexPerMonthUsd`: ~$20,000-40,000
- Total burn should approximate $150k/month
- `newLogosPerMonth`: 10-20 (moderate growth)
- `churnMonthly`: 0.5-0.8% (explicitly low)
- `upsellMonthly`: 0.5-0.8% (good expansion)
- `acvUsd`: Calculated from ARR
- `startCashUsd`: Should calculate to show specific runway

**Reasoning Should Include:**
- Current runway in months
- Whether sustainable or need to raise
- How growth affects runway

---

### Scenario 5: Enterprise B2B
**User Input:**
> "Enterprise B2B SaaS, $5M ARR, selling to Fortune 500, 6-month sales cycle"

**Expected Output:**
- `startArrUsd`: $5,000,000
- `acvUsd`: $100,000-250,000 (enterprise pricing)
- `newLogosPerMonth`: 2-5 (fewer but larger deals)
- `churnMonthly`: 0.3-0.6% (very low for enterprise)
- `upsellMonthly`: 1.0-2.0% (high expansion in enterprise)
- `collectSplit0`: 10-20% (enterprise pays slower)
- `collectSplit1`: 80-90%
- `payrollPerMonthUsd`: $200,000-300,000 (larger team)

**Reasoning Should Include:**
- Longer sales cycles reflected in assumptions
- Enterprise customer behavior
- Collection timing for large contracts

---

### Scenario 6: Bootstrap / Self-Funded
**User Input:**
> "Bootstrapped, $100k ARR, team of 3, profitable, want to grow to $500k ARR in 12 months"

**Expected Output:**
- `startArrUsd`: $100,000
- `payrollPerMonthUsd`: ~$30,000-40,000 (3 people)
- `opexPerMonthUsd`: ~$5,000-10,000 (lean)
- `newLogosPerMonth`: 8-15 (aggressive for 5x growth)
- `churnMonthly`: 1.0-1.5%
- `upsellMonthly`: 0.5-1.0%
- `acvUsd`: $3,000-6,000 (SMB pricing)
- `startCashUsd`: $50,000-150,000 (modest cash position)
- No investment (bootstrap)

**Reasoning Should Include:**
- Growth rate needed (5x)
- Staying profitable/lean
- Capital efficiency

---

### Scenario 7: Complex Multi-Product
**User Input:**
> "SaaS + services business, $3M ARR from software, $1M from consulting, want to scale software to $10M"

**Expected Output:**
- `startArrUsd`: $3,000,000 (software only)
- May need to mention consulting separately in reasoning
- `newLogosPerMonth`: 20-30 (to reach $10M)
- `payrollPerMonthUsd`: Should separate software team from services
- `opexPerMonthUsd`: Higher for scaling sales/marketing

**Reasoning Should Include:**
- Focus on software ARR growth
- How to allocate resources between software and services
- Transitioning from services to product

---

## Validation Checks

For each test scenario, verify:

1. **Mathematical Consistency**
   - ARR growth rate is achievable with new logos + churn + upsell
   - Burn rate = Payroll + OpEx - Collections
   - Runway = Cash / Burn makes sense

2. **Industry Benchmarks**
   - Churn is within 0.5-3% monthly
   - Upsell is within 0.3-2% monthly
   - CAC payback is reasonable (< 18 months)
   - Payroll per employee is $7k-15k loaded

3. **Context Awareness**
   - Pre-revenue has $0 ARR
   - Fundraising adds to cash
   - Enterprise has higher ACV, lower churn
   - Bootstrap has lower burn

4. **Reasoning Quality**
   - Explains key assumptions
   - Mentions potential risks/considerations
   - Provides actionable insights
   - Uses appropriate financial terminology

## Testing Process

1. **Manual Testing**
   - Enter each scenario prompt in the wizard
   - Review generated assumptions
   - Verify reasoning makes sense
   - Check mathematical consistency

2. **Edge Cases**
   - Empty prompt
   - Extremely large numbers ($100M ARR)
   - Nonsensical requests
   - Missing critical information

3. **API Testing**
   - Test with invalid API key
   - Test with rate limiting
   - Test with timeout scenarios
   - Test with malformed responses

## Success Criteria

✅ All scenarios generate realistic assumptions
✅ Reasoning is clear and founder-friendly
✅ Numbers are mathematically consistent
✅ Assumptions align with industry benchmarks
✅ Edge cases handled gracefully
✅ Error messages are helpful
✅ UI remains responsive during generation
