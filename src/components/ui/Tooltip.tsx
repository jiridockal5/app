"use client";

import React, { useState } from "react";

type Props = {
  content: string;
  className?: string;
};

/**
 * Tooltip with built-in "i" icon trigger:
 * - Always positions below the icon
 * - Visible on HOVER or KEYBOARD FOCUS of the trigger only
 */
export default function Tooltip({ content, className }: Props) {
  const id = React.useId();
  const [isVisible, setIsVisible] = useState(false);

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
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-pre-line rounded-lg bg-gray-900 px-4 py-3 text-xs leading-relaxed text-white shadow-xl transition-all duration-200 z-[9999] max-w-sm
          ${
            isVisible
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
        aria-hidden="true"
      >
        <div className="space-y-1.5">
          {content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className={idx === 0 ? "font-semibold text-white" : "text-gray-300 leading-relaxed"}>
              {paragraph}
            </p>
          ))}
        </div>
        {/* Arrow pointer pointing up to the icon */}
        <span
          className="absolute left-1/2 bottom-full -translate-x-1/2 border-4 border-transparent border-b-gray-900"
          aria-hidden="true"
        />
      </span>
    </span>
  );
}

