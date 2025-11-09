"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/state/store";
import { Money } from "@/components/inputs/Money";
import { Num } from "@/components/inputs/Num";
import { Pct } from "@/components/inputs/Pct";
import { Button } from "@/components/ui/Button";

export default function WizardPage() {
  const router = useRouter();
  const a = useAppStore((s) => s.a);
  const set = useAppStore((s) => s.set);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    startArrUsd: a.startArrUsd,
    acvUsd: a.acvUsd,
    newLogosPerMonth: a.newLogosPerMonth,
    churnMonthly: a.churnMonthly,
    upsellMonthly: a.upsellMonthly,
    startCashUsd: a.startCashUsd,
    payrollPerMonthUsd: a.payrollPerMonthUsd,
    opexPerMonthUsd: a.opexPerMonthUsd,
    collectSplit0: a.collectSplit[0],
    collectSplit1: a.collectSplit[1],
    oneOffInvestmentMonth: a.oneOffInvestmentMonth || 0,
    oneOffInvestmentAmountUsd: a.oneOffInvestmentAmountUsd || 0,
  });

  const updateFormData = (field: string, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    // Validate collection split sums to 1
    const splitSum = formData.collectSplit0 + formData.collectSplit1;
    const normalizedSplit0 = splitSum > 0 ? formData.collectSplit0 / splitSum : 0.25;
    const normalizedSplit1 = splitSum > 0 ? formData.collectSplit1 / splitSum : 0.75;

    set({
      startArrUsd: formData.startArrUsd,
      acvUsd: formData.acvUsd,
      newLogosPerMonth: formData.newLogosPerMonth,
      churnMonthly: formData.churnMonthly,
      upsellMonthly: formData.upsellMonthly,
      startCashUsd: formData.startCashUsd,
      payrollPerMonthUsd: formData.payrollPerMonthUsd,
      opexPerMonthUsd: formData.opexPerMonthUsd,
      collectSplit: [normalizedSplit0, normalizedSplit1],
      oneOffInvestmentMonth: formData.oneOffInvestmentMonth > 0 ? formData.oneOffInvestmentMonth : undefined,
      oneOffInvestmentAmountUsd: formData.oneOffInvestmentAmountUsd > 0 ? formData.oneOffInvestmentAmountUsd : undefined,
    });

    router.push("/plan");
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <main className="flex-1 p-6 md:p-10 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-6 md:p-8 space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Setup Wizard</h1>
            <span className="text-sm text-gray-500">Step {step} of 3</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step 1: Revenue Drivers */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Revenue Drivers</h2>
              <p className="text-sm text-gray-600">
                Set up your revenue assumptions to forecast growth.
              </p>

              <Money
                label="Starting ARR (USD)"
                value={formData.startArrUsd}
                onChange={(e) => updateFormData("startArrUsd", Number(e.target.value))}
                helperText="Annual Recurring Revenue at the start of the forecast"
              />

              <Money
                label="Average Price per Customer (ACV)"
                value={formData.acvUsd}
                onChange={(e) => updateFormData("acvUsd", Number(e.target.value))}
                helperText="Average annual contract value per customer"
              />

              <Num
                label="New Customers per Month"
                value={formData.newLogosPerMonth}
                onChange={(e) => updateFormData("newLogosPerMonth", Number(e.target.value))}
                min={0}
                step={1}
                helperText="Number of new customers you expect to acquire each month"
              />

              <Pct
                label="Monthly Churn Rate"
                value={formData.churnMonthly}
                onChange={(e) => updateFormData("churnMonthly", Number(e.target.value))}
                helperText="Percentage of customers lost each month (e.g., 0.8% = 0.8)"
                min={0}
                max={100}
                step={0.1}
              />

              <Pct
                label="Monthly Upsell Rate"
                value={formData.upsellMonthly}
                onChange={(e) => updateFormData("upsellMonthly", Number(e.target.value))}
                helperText="Percentage increase in ARR from upsells/expansions each month (e.g., 0.3% = 0.3)"
                min={0}
                max={100}
                step={0.1}
              />
            </div>
          )}

          {/* Step 2: Cash & Collections */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Cash & Collections</h2>
              <p className="text-sm text-gray-600">
                Configure your starting cash and collection timing.
              </p>

              <Money
                label="Starting Cash (USD)"
                value={formData.startCashUsd}
                onChange={(e) => updateFormData("startCashUsd", Number(e.target.value))}
                helperText="Cash balance at the start of the forecast"
              />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">
                  Collection Split (Current Month / Previous Month)
                </h3>
                <p className="text-xs text-gray-500">
                  How revenue is collected: % in current month vs % in next month
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Pct
                    label="Current Month %"
                    value={formData.collectSplit0}
                    onChange={(e) => updateFormData("collectSplit0", Number(e.target.value))}
                    helperText="% collected in same month"
                    min={0}
                    max={100}
                    step={1}
                  />
                  <Pct
                    label="Next Month %"
                    value={formData.collectSplit1}
                    onChange={(e) => updateFormData("collectSplit1", Number(e.target.value))}
                    helperText="% collected in following month"
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                {Math.abs(formData.collectSplit0 + formData.collectSplit1 - 100) > 0.1 && (
                  <p className="text-sm text-amber-600">
                    Note: Split should sum to 100%. Will be normalized automatically.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Expenses */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Expenses</h2>
              <p className="text-sm text-gray-600">
                Set your monthly payroll and operational expenses.
              </p>

              <Money
                label="Monthly Payroll (USD)"
                value={formData.payrollPerMonthUsd}
                onChange={(e) => updateFormData("payrollPerMonthUsd", Number(e.target.value))}
                helperText="Total monthly payroll costs for your team"
              />

              <Money
                label="Monthly Operating Expenses (USD)"
                value={formData.opexPerMonthUsd}
                onChange={(e) => updateFormData("opexPerMonthUsd", Number(e.target.value))}
                helperText="Tools, ads, infrastructure, and other operational costs"
              />

              <div className="border-t pt-6 space-y-4">
                <h3 className="text-sm font-medium text-gray-700">
                  One-Off Investment (Optional)
                </h3>
                <p className="text-xs text-gray-500">
                  Add a one-time investment or funding round during the forecast
                </p>

                <Num
                  label="Investment Month"
                  value={formData.oneOffInvestmentMonth}
                  onChange={(e) => updateFormData("oneOffInvestmentMonth", Number(e.target.value))}
                  min={0}
                  max={12}
                  step={1}
                  helperText="Month when investment occurs (1-12, or 0 to skip)"
                />

                <Money
                  label="Investment Amount (USD)"
                  value={formData.oneOffInvestmentAmountUsd}
                  onChange={(e) => updateFormData("oneOffInvestmentAmountUsd", Number(e.target.value))}
                  helperText="Amount of one-time investment"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              onClick={handleBack}
              disabled={step === 1}
              variant="secondary"
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              {step === 3 ? "Finish & View Plan" : "Next"}
            </Button>
          </div>
        </div>

        {/* Skip link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/plan")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip wizard and use defaults
          </button>
        </div>
      </div>
    </main>
  );
}

