/**
 * Money input component
 */

import { Num } from "./Num";
import { InputHTMLAttributes } from "react";

interface MoneyProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  helperText?: string;
  error?: string;
}

export function Money({ label, helperText, error, ...props }: MoneyProps) {
  return (
    <Num
      label={label}
      helperText={helperText}
      error={error}
      type="number"
      step={1000}
      min={0}
      {...props}
    />
  );
}

