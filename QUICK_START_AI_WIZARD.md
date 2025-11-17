# Quick Start: AI Budget Wizard

## 🚀 Setup (2 minutes)

### 1. Get Your OpenAI API Key

1. Visit [platform.openai.com](https://platform.openai.com)
2. Sign in or create an account
3. Go to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-proj-...`)

### 2. Configure Environment

```bash
# Copy the example file
cp .env.example .env.local

# Open .env.local and paste your API key
# Replace "your_openai_api_key_here" with your actual key
```

Your `.env.local` should look like:
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

### 3. Install & Run

```bash
# Install dependencies (includes openai, ai, zod)
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000/wizard](http://localhost:3000/wizard)

## 💬 How to Use

### Step 1: Describe Your Goals

Simply type what you want to achieve in natural language. Examples:

**Fundraising:**
```
We want to raise $1M USD to invest into GTM and product team
```

**Growth Planning:**
```
We have $500k ARR and want to double in 12 months with 5 engineers and 3 sales reps
```

**Pre-Revenue:**
```
Pre-revenue startup, need to hire 4 engineers and 2 salespeople, plan to close first customers in month 3
```

**Runway Analysis:**
```
$2M ARR, low churn, want to understand runway with current burn of $150k/month
```

### Step 2: AI Generates Budget (2-5 seconds)

GPT-4 will:
- Analyze your goals
- Apply SaaS industry benchmarks
- Generate realistic assumptions
- Explain its reasoning

### Step 3: Review & Edit

You'll see all assumptions with:
- ✅ Clear labels and helper text
- ✅ AI reasoning for transparency
- ✅ Ability to edit any value
- ✅ Option to regenerate with new prompt

### Step 4: Apply & View Plan

Click "Apply & View Plan" to:
- Save assumptions to your budget
- Generate 12-month forecast
- See KPIs, charts, and monthly breakdown

## 🎯 Example Prompts to Try

Copy/paste these into the wizard:

### 1. Seed Stage Startup
```
We just raised $800k seed funding. Plan to hire 3 engineers at $120k each and 1 salesperson at $80k + commission. Want to launch product in month 2 and start acquiring customers at 10 per month. Aiming for $5k ACV.
```

### 2. Series A Planning
```
Currently at $1.2M ARR with 15 customers. Planning to raise $3M Series A to hire 5 more sales reps and 8 engineers. Want to reach $5M ARR in 18 months. Current churn is about 1% per month.
```

### 3. Bootstrap to Profitability
```
Bootstrapped company with $200k ARR. Team of 4 people costing $40k/month total. Want to grow to $1M ARR while staying profitable. No outside funding.
```

### 4. Scale-Up Mode
```
$10M ARR growing 100% YoY. 50 employees, $400k monthly burn. Just closed $15M Series B. Need to plan aggressive hiring: 20 engineers, 15 sales, 10 other roles over next year.
```

### 5. Turnaround Scenario
```
$3M ARR but burning $200k/month. Have $1M cash left. Need to cut burn to $100k and extend runway to 18 months while maintaining growth.
```

## 🧠 What the AI Considers

The AI uses these benchmarks when generating your budget:

**Revenue Drivers:**
- Monthly churn: 0.5-2% (lower = better)
- Monthly upsell/expansion: 0.3-1%
- ACV: $3k-50k (SMB) or $50k+ (Enterprise)
- New logos/month: Based on your team size and GTM motion

**Team Costs:**
- Engineers: ~$12k/month loaded cost
- Sales: ~$10k/month loaded cost  
- Marketing: ~$8k/month loaded cost
- Other: ~$8k/month loaded cost

**Operating Expenses:**
- Early stage: 15-25% of payroll
- Growth stage: 20-30% of payroll
- Includes: Tools, ads, infrastructure, office

**Cash Flow:**
- Collection timing: Usually 25% same month, 75% next month
- Investment timing: Typically month 1-3 for fundraising

## ✅ What's Generated

The AI creates **12 core assumptions**:

1. Starting ARR
2. Average Contract Value (ACV)
3. New Customers per Month
4. Monthly Churn Rate %
5. Monthly Upsell Rate %
6. Starting Cash Balance
7. Monthly Payroll
8. Monthly Operating Expenses
9. Cash Collection Split (current/next month)
10. One-time Investment Amount (optional)
11. Investment Month (optional)
12. **Reasoning** - Why these numbers make sense

## 🔧 Troubleshooting

**Nothing happens when I click "Generate Budget"**
- Check browser console (F12) for errors
- Verify API key is in `.env.local`
- Restart dev server: `npm run dev`

**Error: "OpenAI API key not configured"**
- API key not set in `.env.local`
- Or dev server needs restart

**Error: "Failed to generate budget"**
- Invalid API key
- No credits in OpenAI account
- Network issue
- Check server terminal for detailed logs

**Generated numbers seem off**
- You can edit any value in the review step
- Or go back and provide more detail in your prompt
- Try being more specific: mention current ARR, team size, etc.

## 💰 Cost

- **Model**: GPT-4 (gpt-4o-2024-08-06)
- **Cost**: ~$0.01-0.03 per generation
- **Example**: 50 generations = ~$1

Monitor usage at [platform.openai.com/usage](https://platform.openai.com/usage)

## 🎓 Tips for Best Results

### Be Specific
❌ "I want to grow my startup"
✅ "I have $500k ARR, want to grow to $2M in 12 months"

### Include Key Details
- Current ARR (if any)
- Team size and roles
- Fundraising plans
- Growth goals
- Any constraints (e.g., "need to stay profitable")

### Mention What's Important
- "Low churn is critical for us"
- "Enterprise customers with long sales cycles"
- "We're pre-revenue but launching in Q2"

### Iterate
- Generate → Review → Go back and refine prompt
- Add more context if numbers seem off
- The more detail you provide, the better the output

## 📚 Learn More

- **Setup Guide**: `docs/AI_WIZARD_SETUP.md`
- **Test Scenarios**: `docs/AI_WIZARD_TEST_SCENARIOS.md`
- **Full Summary**: `docs/AI_WIZARD_SUMMARY.md`
- **Implementation Status**: `IMPLEMENTATION_STATUS.md`

## 🎉 You're Ready!

1. Add your OpenAI API key to `.env.local`
2. Run `npm run dev`
3. Visit `/wizard`
4. Describe your goals
5. Get a realistic budget in seconds!

The AI wizard makes financial planning as easy as having a conversation. No spreadsheets, no financial jargon, just plain English.
