import Tooltip from "@/components/ui/Tooltip";

interface KpiCardProps {
  title: string;
  primaryValue: string;
  secondaryValue?: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  tooltip?: string;
}

export function KpiCard({
  title,
  primaryValue,
  secondaryValue,
  change,
  tooltip,
}: KpiCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {tooltip && <Tooltip content={tooltip} />}
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

