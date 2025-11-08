"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  primaryValue: string;
  secondaryValue?: string;
  updated?: string;
  children: ReactNode;
}

export function ChartCard({
  title,
  primaryValue,
  secondaryValue,
  updated,
  children,
}: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <div className="mt-1">
            <span className="text-2xl font-semibold text-gray-900">
              {primaryValue}
            </span>
            {secondaryValue && (
              <span className="text-sm text-gray-500 ml-2">
                {secondaryValue}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {updated && (
            <span className="text-xs text-gray-400">Updated {updated}</span>
          )}
          <button className="text-gray-400 hover:text-gray-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

