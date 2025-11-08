"use client";

import React, { useState } from "react";

type Props = {
  content: string | string[];
  className?: string;
};

/** Normalize tooltip text:
 * - Turn literal "\\n" into real newlines
 * - Collapse excess blank lines
 * - Trim ends
 */
function normalizeText(input: string | string[]) {
  const raw = Array.isArray(input) ? input.join("\n") : input;
  const step1 = raw.replace(/\\n/g, "\n"); // show \n as real newline
  const step2 = step1.replace(/\n{3,}/g, "\n\n"); // collapse 3+ to 2
  const step3 = step2.replace(/^\s+|\s+$/g, ""); // trim
  return step3.split("\n"); // return lines
}

/**
 * Tooltip with built-in "i" icon trigger:
 * - Always positions below the icon
 * - Visible on HOVER or KEYBOARD FOCUS of the trigger only
 */
export default function Tooltip({ content, className }: Props) {
  const id = React.useId();
  const [isVisible, setIsVisible] = useState(false);
  const lines = normalizeText(content);

  return (
    <span className={`relative inline-flex ${className || ""}`}>
      {/* trigger */}
      <button
        type="button"
        aria-describedby={id}
        className="peer inline-flex items-center justify-center w-5 h-5 rounded-full border text-[10px] leading-none text-gray-600 border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
        tabIndex={0}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        i
      </button>
      {/* tooltip panel - always positioned below */}
      <span
        id={id}
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 rounded-lg bg-gray-900 px-4 py-3 text-xs text-white shadow-xl transition-all duration-200 z-[9999] max-w-sm break-words
          ${
            isVisible
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
        aria-hidden="true"
      >
        {lines.map((ln, i) => (
          <React.Fragment key={i}>
            {ln}
            {i < lines.length - 1 ? <br /> : null}
          </React.Fragment>
        ))}
        {/* Arrow pointer pointing up to the icon */}
        <span
          className="absolute left-1/2 bottom-full -translate-x-1/2 border-4 border-transparent border-b-gray-900"
          aria-hidden="true"
        />
      </span>
    </span>
  );
}
