"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/state/store";
import { Button } from "@/components/ui/Button";
import { Money } from "@/components/inputs/Money";
import { Num } from "@/components/inputs/Num";
import { Pct } from "@/components/inputs/Pct";

interface BudgetAssumptions {
  startArrUsd: number;
  acvUsd: number;
  newLogosPerMonth: number;
  churnMonthly: number;
  upsellMonthly: number;
  startCashUsd: number;
  payrollPerMonthUsd: number;
  opexPerMonthUsd: number;
  collectSplit0: number;
  collectSplit1: number;
  oneOffInvestmentMonth?: number;
  oneOffInvestmentAmountUsd?: number;
  reasoning: string;
}

export default function WizardPage() {
  const router = useRouter();
  const set = useAppStore((s) => s.set);

  const [step, setStep] = useState<"prompt" | "review">("prompt");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedAssumptions, setGeneratedAssumptions] = useState<BudgetAssumptions | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe your goals");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate budget");
      }

      const assumptions = await response.json();
      setGeneratedAssumptions(assumptions);
      setStep("review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!generatedAssumptions) return;

    const splitSum = generatedAssumptions.collectSplit0 + generatedAssumptions.collectSplit1;
    const normalizedSplit0 = splitSum > 0 ? generatedAssumptions.collectSplit0 / splitSum : 0.25;
    const normalizedSplit1 = splitSum > 0 ? generatedAssumptions.collectSplit1 / splitSum : 0.75;

    set({
      startArrUsd: generatedAssumptions.startArrUsd,
      acvUsd: generatedAssumptions.acvUsd,
      newLogosPerMonth: generatedAssumptions.newLogosPerMonth,
      churnMonthly: generatedAssumptions.churnMonthly,
      upsellMonthly: generatedAssumptions.upsellMonthly,
      startCashUsd: generatedAssumptions.startCashUsd,
      payrollPerMonthUsd: generatedAssumptions.payrollPerMonthUsd,
      opexPerMonthUsd: generatedAssumptions.opexPerMonthUsd,
      collectSplit: [normalizedSplit0, normalizedSplit1],
      oneOffInvestmentMonth: generatedAssumptions.oneOffInvestmentMonth && generatedAssumptions.oneOffInvestmentMonth > 0 
        ? generatedAssumptions.oneOffInvestmentMonth 
        : undefined,
      oneOffInvestmentAmountUsd: generatedAssumptions.oneOffInvestmentAmountUsd && generatedAssumptions.oneOffInvestmentAmountUsd > 0
        ? generatedAssumptions.oneOffInvestmentAmountUsd
        : undefined,
    });

    router.push("/plan");
  };

  const updateAssumption = (field: keyof BudgetAssumptions, value: number) => {
    if (!generatedAssumptions) return;
    setGeneratedAssumptions({
      ...generatedAssumptions,
      [field]: value,
    });
  };

  return (
    <main className="flex-1 p-6 md:p-10 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* Prompt Step */}
        {step === "prompt" && (
          <div className="bg-white rounded-2xl shadow p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold">AI Budget Wizard</h1>
              <p className="text-gray-600">
                Describe your goals and let AI generate a realistic budget for your SaaS business.
              </p>
            </div>

            {/* Examples */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-blue-900">Example prompts:</p>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">💡</span>
                  <span>&quot;We want to raise $1M USD to invest in GTM and product team&quot;</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">💡</span>
                  <span>&quot;We have $500k ARR, want to double in 12 months with 5 engineers and 3 sales reps&quot;</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">💡</span>
                  <span>&quot;Pre-revenue startup, need to hire 4 engineers and 2 salespeople, plan to close first customers in month 3&quot;</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">💡</span>
                  <span>&quot;$2M ARR, low churn, want to understand runway with current burn of $150k/month&quot;</span>
                </li>
              </ul>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                Describe your business goals
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., We want to raise $1M to hire 5 engineers and 3 sales people, currently at $500k ARR..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => router.push("/plan")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Skip and use defaults
              </button>
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "Generate Budget"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Review Step */}
        {step === "review" && generatedAssumptions && (
          <div className="bg-white rounded-2xl shadow p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Review Your Budget</h1>
              <p className="text-sm text-gray-600">
                AI has generated these assumptions based on your goals. Review and adjust as needed.
              </p>
            </div>

            {/* AI Reasoning */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">💡 AI Reasoning:</p>
              <p className="text-sm text-blue-800">{generatedAssumptions.reasoning}</p>
            </div>

            {/* Generated Assumptions */}
            <div className="space-y-6">
              {/* Revenue Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Revenue Drivers</h3>
                
                <Money
                  label="Starting ARR (USD)"
                  value={generatedAssumptions.startArrUsd}
                  onChange={(e) => updateAssumption("startArrUsd", Number(e.target.value))}
                  helperText="Annual Recurring Revenue at the start"
                />

                <Money
                  label="Average Price per Customer (ACV)"
                  value={generatedAssumptions.acvUsd}
                  onChange={(e) => updateAssumption("acvUsd", Number(e.target.value))}
                  helperText="Average annual contract value per customer"
                />

                <Num
                  label="New Customers per Month"
                  value={generatedAssumptions.newLogosPerMonth}
                  onChange={(e) => updateAssumption("newLogosPerMonth", Number(e.target.value))}
                  min={0}
                  step={1}
                  helperText="Expected new customer acquisition rate"
                />

                <Pct
                  label="Monthly Churn Rate"
                  value={generatedAssumptions.churnMonthly}
                  onChange={(e) => updateAssumption("churnMonthly", Number(e.target.value))}
                  helperText="Percentage of customers lost each month"
                  min={0}
                  max={100}
                  step={0.1}
                />

                <Pct
                  label="Monthly Upsell Rate"
                  value={generatedAssumptions.upsellMonthly}
                  onChange={(e) => updateAssumption("upsellMonthly", Number(e.target.value))}
                  helperText="Percentage increase from expansions each month"
                  min={0}
                  max={100}
                  step={0.1}
                />
              </div>

              {/* Cash Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Cash & Collections</h3>
                
                <Money
                  label="Starting Cash (USD)"
                  value={generatedAssumptions.startCashUsd}
                  onChange={(e) => updateAssumption("startCashUsd", Number(e.target.value))}
                  helperText="Cash balance at the start"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Pct
                    label="Current Month %"
                    value={generatedAssumptions.collectSplit0}
                    onChange={(e) => updateAssumption("collectSplit0", Number(e.target.value))}
                    helperText="% collected same month"
                    min={0}
                    max={100}
                    step={1}
                  />
                  <Pct
                    label="Next Month %"
                    value={generatedAssumptions.collectSplit1}
                    onChange={(e) => updateAssumption("collectSplit1", Number(e.target.value))}
                    helperText="% collected next month"
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>

              {/* Expenses Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Expenses</h3>
                
                <Money
                  label="Monthly Payroll (USD)"
                  value={generatedAssumptions.payrollPerMonthUsd}
                  onChange={(e) => updateAssumption("payrollPerMonthUsd", Number(e.target.value))}
                  helperText="Total monthly payroll costs"
                />

                <Money
                  label="Monthly Operating Expenses (USD)"
                  value={generatedAssumptions.opexPerMonthUsd}
                  onChange={(e) => updateAssumption("opexPerMonthUsd", Number(e.target.value))}
                  helperText="Tools, ads, infrastructure costs"
                />
              </div>

              {/* Investment Section */}
              {generatedAssumptions.oneOffInvestmentMonth && generatedAssumptions.oneOffInvestmentMonth > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">One-Time Investment</h3>
                  
                  <Num
                    label="Investment Month"
                    value={generatedAssumptions.oneOffInvestmentMonth}
                    onChange={(e) => updateAssumption("oneOffInvestmentMonth", Number(e.target.value))}
                    min={0}
                    max={12}
                    step={1}
                    helperText="Month when investment occurs"
                  />

                  <Money
                    label="Investment Amount (USD)"
                    value={generatedAssumptions.oneOffInvestmentAmountUsd || 0}
                    onChange={(e) => updateAssumption("oneOffInvestmentAmountUsd", Number(e.target.value))}
                    helperText="Amount of one-time investment"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                onClick={() => {
                  setStep("prompt");
                  setError(null);
                }}
                variant="secondary"
              >
                ← Back to Edit Prompt
              </Button>
              <Button onClick={handleApply}>
                Apply & View Plan →
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
