/**
 * Percentage input component
 */

import { Num } from "./Num";
import { InputHTMLAttributes } from "react";

interface PctProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  helperText?: string;
  error?: string;
  showAsPercent?: boolean; // If true, display value as percentage
}

export function Pct({
  label,
  helperText,
  error,
  showAsPercent = true,
  value,
  onChange,
  ...props
}: PctProps) {
  const displayValue = showAsPercent && typeof value === "number"
    ? value * 100
    : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showAsPercent && onChange) {
      const decimalValue = Number(e.target.value) / 100;
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: decimalValue.toString(),
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(newEvent);
    } else if (onChange) {
      onChange(e);
    }
  };

  return (
    <div>
      <Num
        label={label}
        helperText={helperText}
        error={error}
        type="number"
        step={0.1}
        min={showAsPercent ? 0 : undefined}
        max={showAsPercent ? 100 : undefined}
        value={displayValue}
        onChange={handleChange}
        {...(onChange ? {} : props)}
      />
      {showAsPercent && typeof value === "number" && (
        <p className="text-xs text-gray-500 mt-1">
          {value.toFixed(3)} (as decimal)
        </p>
      )}
    </div>
  );
}

