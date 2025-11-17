import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

// Schema for budget assumptions
const BudgetAssumptionsSchema = z.object({
  startArrUsd: z.number().min(0).describe("Starting ARR in USD"),
  acvUsd: z.number().min(0).describe("Average contract value per customer per year"),
  newLogosPerMonth: z.number().min(0).describe("Number of new customers per month"),
  churnMonthly: z.number().min(0).max(100).describe("Monthly churn rate as percentage (e.g., 2 = 2%)"),
  upsellMonthly: z.number().min(0).max(100).describe("Monthly upsell/expansion rate as percentage"),
  startCashUsd: z.number().min(0).describe("Starting cash balance in USD"),
  payrollPerMonthUsd: z.number().min(0).describe("Total monthly payroll costs"),
  opexPerMonthUsd: z.number().min(0).describe("Monthly operating expenses (tools, ads, infrastructure)"),
  collectSplit0: z.number().min(0).max(100).describe("Percentage collected in current month"),
  collectSplit1: z.number().min(0).max(100).describe("Percentage collected in next month"),
  oneOffInvestmentMonth: z.number().min(0).max(12).optional().describe("Month when investment occurs (0 to skip)"),
  oneOffInvestmentAmountUsd: z.number().min(0).optional().describe("Amount of one-time investment"),
  reasoning: z.string().describe("Brief explanation of the assumptions made"),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a financial advisor helping B2B SaaS founders create realistic budgets and forecasts.

Your task is to interpret the founder's goals and generate realistic budget assumptions for a 12-month forecast.

Guidelines:
- Use industry-standard SaaS metrics and benchmarks
- Be conservative but realistic
- If raising funds, assume it affects starting cash
- Typical B2B SaaS benchmarks:
  * Monthly churn: 0.5-2% for good retention
  * Monthly upsell/expansion: 0.3-1% 
  * ACV (Average Contract Value): $3,000-$50,000 for SMB, $50,000+ for enterprise
  * New logos per month: 5-50 depending on stage and GTM motion
  * Payroll: $8,000-$15,000 per employee per month (loaded cost)
  * OpEx: 10-30% of payroll for early stage
  * Cash collection: Usually 25% same month, 75% next month
  
- If they mention "raising $XM":
  * Add to starting cash
  * Suggest realistic deployment timeline
  * Account for increased burn
  
- If they mention team expansion:
  * Calculate realistic payroll (eng: $12k/mo, sales: $10k/mo, marketing: $8k/mo avg)
  * Add 20% overhead for tools/infrastructure
  
- If they're pre-revenue, start with $0 ARR
- If they mention specific revenue/ARR, use that
- Investment timing: if raising funds, typically month 1-3

Output realistic, actionable numbers that will help the founder understand their runway and growth trajectory.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "budget_assumptions",
          strict: true,
          schema: {
            type: "object",
            properties: {
              startArrUsd: {
                type: "number",
                description: "Starting ARR in USD",
              },
              acvUsd: {
                type: "number",
                description: "Average contract value per customer per year",
              },
              newLogosPerMonth: {
                type: "number",
                description: "Number of new customers per month",
              },
              churnMonthly: {
                type: "number",
                description: "Monthly churn rate as percentage (e.g., 2 = 2%)",
              },
              upsellMonthly: {
                type: "number",
                description: "Monthly upsell/expansion rate as percentage",
              },
              startCashUsd: {
                type: "number",
                description: "Starting cash balance in USD",
              },
              payrollPerMonthUsd: {
                type: "number",
                description: "Total monthly payroll costs",
              },
              opexPerMonthUsd: {
                type: "number",
                description: "Monthly operating expenses (tools, ads, infrastructure)",
              },
              collectSplit0: {
                type: "number",
                description: "Percentage collected in current month",
              },
              collectSplit1: {
                type: "number",
                description: "Percentage collected in next month",
              },
              oneOffInvestmentMonth: {
                type: "number",
                description: "Month when investment occurs (0 to skip)",
              },
              oneOffInvestmentAmountUsd: {
                type: "number",
                description: "Amount of one-time investment",
              },
              reasoning: {
                type: "string",
                description: "Brief explanation of the assumptions made",
              },
            },
            required: [
              "startArrUsd",
              "acvUsd",
              "newLogosPerMonth",
              "churnMonthly",
              "upsellMonthly",
              "startCashUsd",
              "payrollPerMonthUsd",
              "opexPerMonthUsd",
              "collectSplit0",
              "collectSplit1",
              "oneOffInvestmentMonth",
              "oneOffInvestmentAmountUsd",
              "reasoning",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsedContent = JSON.parse(content);
    const assumptions = BudgetAssumptionsSchema.parse(parsedContent);

    return NextResponse.json(assumptions);
  } catch (error) {
    console.error("Error generating budget:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid budget assumptions generated", details: error.issues },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to generate budget assumptions" },
      { status: 500 }
    );
  }
}
