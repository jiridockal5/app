"use client";

import React from "react";

type Props = {
  content: string;
  className?: string;
};

/**
 * CSS-only tooltip with built-in "i" icon trigger:
 * - Hidden by default
 * - Visible on HOVER or KEYBOARD FOCUS of the trigger only
 */
export default function Tooltip({ content, className }: Props) {
  const id = React.useId();
  return (
    <span className={`relative inline-flex ${className || ""}`}>
      {/* trigger */}
      <button
        type="button"
        aria-describedby={id}
        className="peer inline-flex items-center justify-center w-5 h-5 rounded-full border text-[10px] leading-none text-gray-600 border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
        tabIndex={0}
      >
        i
      </button>
      {/* tooltip panel (shown only when trigger is hovered/focused) */}
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-pre-line rounded-lg bg-gray-900 px-4 py-3 text-xs leading-relaxed text-white shadow-xl opacity-0 invisible transition-all duration-200
                  peer-hover:opacity-100 peer-hover:visible
                  peer-focus-visible:opacity-100 peer-focus-visible:visible z-50 max-w-sm"
        aria-hidden="true"
      >
        <div className="space-y-1.5">
          {content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className={idx === 0 ? "font-semibold text-white" : "text-gray-300 leading-relaxed"}>
              {paragraph}
            </p>
          ))}
        </div>
        <span
          className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900"
          aria-hidden="true"
        />
      </span>
    </span>
  );
}

