"use client";

import { useState } from "react";
import { useAppStore } from "@/state/store";

type Department = {
  id: string;
  name: string;
  icon: string;
  headcount: number;
  avgCostPerPerson: number;
};

const $$ = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

const formatNumber = (n: number) =>
  n.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  });

export default function PeoplePage() {
  const a = useAppStore((s) => s.a);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Calculate average cost per person from total payroll
  // Assuming payroll is distributed across departments
  const avgCostPerPerson = a.payrollPerMonthUsd / 20; // Rough estimate

  const departments: Department[] = [
    {
      id: "customer-success",
      name: "Customer Success",
      icon: "💬",
      headcount: 3,
      avgCostPerPerson: avgCostPerPerson,
    },
    {
      id: "customer-support",
      name: "Customer Support",
      icon: "🎧",
      headcount: 2,
      avgCostPerPerson: avgCostPerPerson * 0.8, // Support typically costs less
    },
    {
      id: "sales",
      name: "Sales",
      icon: "📞",
      headcount: 5,
      avgCostPerPerson: avgCostPerPerson * 1.2, // Sales typically costs more
    },
    {
      id: "marketing",
      name: "Marketing",
      icon: "📢",
      headcount: 3,
      avgCostPerPerson: avgCostPerPerson,
    },
    {
      id: "business-development",
      name: "Business Development",
      icon: "🤝",
      headcount: 2,
      avgCostPerPerson: avgCostPerPerson * 1.1,
    },
    {
      id: "rd",
      name: "R&D",
      icon: "🔬",
      headcount: 8,
      avgCostPerPerson: avgCostPerPerson * 1.15, // R&D typically costs more
    },
    {
      id: "ga",
      name: "G&A",
      icon: "⚙️",
      headcount: 2,
      avgCostPerPerson: avgCostPerPerson * 0.9,
    },
  ];

  const totalHeadcount = departments.reduce((sum, dept) => sum + dept.headcount, 0);
  const totalMonthlyCost = departments.reduce(
    (sum, dept) => sum + dept.headcount * dept.avgCostPerPerson,
    0
  );

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <main className="flex-1 p-6 md:p-10 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">People</h1>
          <p className="text-gray-600 mt-2">
            Manage headcount and costs by department
          </p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-2">Total Headcount</div>
            <div className="text-3xl font-bold text-gray-900">
              {formatNumber(totalHeadcount)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Across all departments</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-2">Monthly Payroll</div>
            <div className="text-3xl font-bold text-gray-900">
              {$$(totalMonthlyCost)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Total monthly cost</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-2">Average Cost per Person</div>
            <div className="text-3xl font-bold text-gray-900">
              {$$(avgCostPerPerson)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Monthly average</div>
          </div>
        </div>

        {/* Department Sections */}
        <div className="space-y-4">
          {departments.map((dept) => {
            const deptMonthlyCost = dept.headcount * dept.avgCostPerPerson;
            const deptAnnualCost = deptMonthlyCost * 12;
            const isExpanded = expandedSection === dept.id;

            return (
              <div
                key={dept.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(dept.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{dept.icon}</div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {dept.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">
                          {dept.headcount} {dept.headcount === 1 ? "person" : "people"}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {$$(deptMonthlyCost)}/month
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {$$(deptAnnualCost)}/year
                      </div>
                      <div className="text-xs text-gray-500">
                        {((deptMonthlyCost / totalMonthlyCost) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isExpanded ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-sm text-gray-500 mb-2">Headcount</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {dept.headcount}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">People in department</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-2">Avg. Cost per Person</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {$$(dept.avgCostPerPerson)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Monthly average</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-2">Monthly Cost</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {$$(deptMonthlyCost)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Annual: {$$(deptAnnualCost)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Placeholder for future: team member list, roles, etc. */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-500 italic">
                        Team member details and role management coming soon
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Total Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-2">Total Headcount</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(totalHeadcount)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">Monthly Payroll</div>
              <div className="text-2xl font-bold text-gray-900">
                {$$(totalMonthlyCost)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">Annual Payroll</div>
              <div className="text-2xl font-bold text-gray-900">
                {$$(totalMonthlyCost * 12)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-2">Avg. Cost per Person</div>
              <div className="text-2xl font-bold text-gray-900">
                {$$(totalMonthlyCost / totalHeadcount)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
