"use client";

import React, { useState } from "react";

type Width = "sm" | "md" | "lg";

type Props = {
  content: string | string[];
  className?: string;
  width?: Width; // tooltip max width
};

function normalizeBlocks(input: string | string[]) {
  const raw = Array.isArray(input) ? input.join("\n") : input;
  const text = raw.replace(/\\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  // Split to paragraphs by double newline, keep single newline as <br/>
  return text.split("\n\n").map((p) => p.split("\n"));
}

const WIDTH_MAP: Record<Width, string> = {
  sm: "max-w-56", // 14rem
  md: "max-w-80", // 20rem
  lg: "max-w-96", // 24rem
};

/**
 * Tooltip with built-in "i" icon trigger:
 * - Always positions below the icon
 * - Visible on HOVER or KEYBOARD FOCUS of the trigger only
 * - Configurable width for better readability
 */
export default function Tooltip({ content, className, width = "lg" }: Props) {
  const id = React.useId();
  const [isVisible, setIsVisible] = useState(false);
  const blocks = normalizeBlocks(content);

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
        className={[
          "pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2",
          "rounded-xl bg-gray-900 px-5 py-4 text-sm leading-6 text-white shadow-xl",
          "transition-all duration-200 z-[9999]",
          WIDTH_MAP[width],
          "break-words",
          isVisible ? "opacity-100 visible" : "opacity-0 invisible",
        ].join(" ")}
        aria-hidden="true"
      >
        {blocks.map((lines, idx) => (
          <p key={idx} className={idx ? "mt-3" : ""}>
            {lines.map((ln, i) => (
              <React.Fragment key={i}>
                {ln}
                {i < lines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </p>
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
