# AI Budget Wizard Setup

The AI Budget Wizard uses OpenAI's GPT-4 to generate realistic budget assumptions from natural language descriptions.

## Setup Instructions

### 1. Get an OpenAI API Key

1. Go to [OpenAI's platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you won't be able to see it again)

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API key:

```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

The AI Wizard will now be available at `http://localhost:3000/wizard`.

## How It Works

### User Experience

1. **Prompt Step**: Founders describe their goals in natural language
   - Example: "We want to raise $1M to hire 5 engineers and 3 sales people"
   - Example: "We have $500k ARR and want to double in 12 months"

2. **AI Generation**: The system sends the prompt to GPT-4 with:
   - A financial advisor system prompt with SaaS industry benchmarks
   - Structured JSON schema for consistent output
   - Validation using Zod schemas

3. **Review Step**: Generated assumptions are displayed with:
   - AI reasoning explaining the assumptions
   - Editable fields for all budget parameters
   - Option to go back and refine the prompt

4. **Apply**: Assumptions are saved to the store and user is redirected to the Plan page

### Technical Architecture

- **API Route**: `/app/api/generate-budget/route.ts`
  - Accepts POST requests with a `prompt` field
  - Uses OpenAI's structured output format for consistent JSON
  - Returns validated budget assumptions

- **Wizard Page**: `/app/wizard/page.tsx`
  - Two-step flow: prompt → review
  - Real-time editing of generated assumptions
  - Integration with existing Zustand store

- **AI Prompt Engineering**:
  - System prompt includes SaaS industry benchmarks
  - Conservative but realistic assumptions
  - Context-aware (raises, team size, stage, etc.)

### Default Benchmarks Used by AI

- **Monthly Churn**: 0.5-2% for good retention
- **Monthly Upsell**: 0.3-1% 
- **ACV**: $3k-$50k for SMB, $50k+ for enterprise
- **New Logos/Month**: 5-50 depending on stage
- **Payroll**: $8k-$15k per employee/month (loaded cost)
- **OpEx**: 10-30% of payroll for early stage
- **Cash Collection**: 25% same month, 75% next month

## Cost Considerations

- Each budget generation uses GPT-4 (gpt-4o-2024-08-06)
- Approximate cost: $0.01-0.03 per generation
- Monitor usage in your OpenAI dashboard

## Error Handling

The wizard handles several error cases:

- Missing API key → 500 error with helpful message
- Invalid prompt → 400 error
- AI generation failure → Error displayed with retry option
- Invalid structured output → Validation error with details

## Testing

Test the wizard with various scenarios:

1. **Pre-revenue startup**: "Pre-revenue, need to hire 4 engineers, plan to launch in month 3"
2. **Growth stage**: "Currently $2M ARR, want to scale to $5M with 20 people"
3. **Fundraising**: "Raising $3M Series A to expand GTM and product"
4. **Conservative**: "Need to extend runway by 6 months with current $500k cash"

## Troubleshooting

### "OpenAI API key not configured"
- Ensure `.env.local` exists with `OPENAI_API_KEY`
- Restart the dev server after adding the key

### "Failed to generate budget assumptions"
- Check API key is valid
- Check OpenAI account has credits
- Check network connectivity
- View server logs for detailed error

### Generation takes too long
- GPT-4 typically responds in 2-5 seconds
- If timeout, check OpenAI API status

## Future Enhancements

Potential improvements:

- [ ] Streaming responses for real-time generation
- [ ] Follow-up questions for ambiguous prompts
- [ ] Multiple scenario generation and comparison
- [ ] Historical context from previous plans
- [ ] Industry-specific templates
- [ ] Integration with actual financial data
