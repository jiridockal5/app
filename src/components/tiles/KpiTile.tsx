/**
 * KPI tile component with optional warnings
 */

interface KpiTileProps {
  label: string;
  value: string | number;
  subtitle?: string;
  warning?: boolean;
  warningMessage?: string;
}

export function KpiTile({
  label,
  value,
  subtitle,
  warning,
  warningMessage,
}: KpiTileProps) {
  const formattedValue =
    typeof value === "number"
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value)
      : value === "∞"
      ? "∞"
      : value;

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 border-l-4 ${
        warning ? "border-l-yellow-500" : "border-l-blue-500"
      }`}
    >
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-semibold text-gray-900">
        {formattedValue}
      </div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
      {warning && warningMessage && (
        <div className="text-xs text-yellow-600 mt-2 font-medium">
          ⚠️ {warningMessage}
        </div>
      )}
    </div>
  );
}

