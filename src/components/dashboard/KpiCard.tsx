interface KpiCardProps {
  title: string;
  primaryValue: string;
  secondaryValue?: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  updated?: string;
}

export function KpiCard({
  title,
  primaryValue,
  secondaryValue,
  change,
  updated,
}: KpiCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-2">
        <div className="text-2xl font-semibold text-gray-900">
          {primaryValue}
        </div>
        {secondaryValue && (
          <div className="text-sm text-gray-500 mt-1">{secondaryValue}</div>
        )}
        {change && (
          <div
            className={`text-sm font-medium mt-2 ${
              change.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {change.isPositive ? "+" : ""}
            {change.value}
          </div>
        )}
      </div>
    </div>
  );
}

