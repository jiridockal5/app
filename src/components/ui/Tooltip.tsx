"use client";

import React, { useState } from "react";

type Align = "center" | "left" | "right";

type Props = {
  content: string | string[];
  className?: string;
  align?: Align; // where to anchor relative to trigger
};

function normalize(rawIn: string | string[]) {
  const raw = Array.isArray(rawIn) ? rawIn.join("\n") : rawIn;
  const txt = raw.replace(/\\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  // Split paragraphs by double newline; keep single newline markers inside blocks.
  return txt.split("\n\n");
}

function renderBlock(block: string, idx: number, hasTopMargin: boolean = idx > 0) {
  // If the block contains pipes, render as a bullet list.
  if (block.includes(" | ")) {
    const items = block.split(" | ").map((s) => s.trim()).filter(Boolean);
    return (
      <ul
        key={idx}
        className={hasTopMargin ? "mt-3 list-disc pl-5 space-y-1" : "list-disc pl-5 space-y-1"}
      >
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    );
  }
  // Otherwise, split single newlines as <br/>
  const lines = block.split("\n");
  return (
    <p key={idx} className={hasTopMargin ? "mt-3" : ""}>
      {lines.map((ln, i) => (
        <React.Fragment key={i}>
          {ln}
          {i < lines.length - 1 ? <br /> : null}
        </React.Fragment>
      ))}
    </p>
  );
}

/**
 * Tooltip with built-in "i" icon trigger:
 * - Always positions below the icon
 * - Visible on HOVER or KEYBOARD FOCUS of the trigger only
 * - Wide bubble with good readability (≈ 60-70 characters)
 * - Supports paragraphs, line breaks, and bullet lists (via pipes)
 */
export default function Tooltip({ content, className, align = "center" }: Props) {
  const id = React.useId();
  const [isVisible, setIsVisible] = useState(false);
  const blocks = normalize(content);

  // Position classes for horizontal alignment
  const pos =
    align === "left"
      ? "left-0 -translate-x-0"
      : align === "right"
      ? "right-0 translate-x-0"
      : "left-1/2 -translate-x-1/2"; // center (default)

  // Check if first block should be a heading (if it's a single short line)
  const firstBlock = blocks[0] || "";
  const firstBlockLines = firstBlock.split("\n");
  const shouldRenderHeading = firstBlockLines.length === 1 && firstBlockLines[0].length < 60;
  const headingText = shouldRenderHeading ? firstBlockLines[0] : null;
  const remainingBlocks = shouldRenderHeading ? blocks.slice(1) : blocks;

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
          "pointer-events-none absolute top-full mt-2",
          pos,
          // Readability: wider, better leading; cap to viewport; rounded & shadow
          "rounded-2xl bg-gray-900/95 text-white shadow-2xl",
          "px-6 py-5 text-[13.5px] leading-[1.55]",
          "max-w-[min(90vw,72ch)]", // ≈ 60-70 characters, capped by viewport
          "transition-all duration-200 z-[9999]",
          "break-words",
          isVisible ? "opacity-100 visible" : "opacity-0 invisible",
        ].join(" ")}
        aria-hidden="true"
      >
        {/* First line as subtle heading if it's a short single line */}
        {headingText && (
          <h3 className="text-[13.5px] font-semibold mb-3 text-white">
            {headingText}
          </h3>
        )}

        {/* Render remaining blocks */}
        {remainingBlocks.map((block, idx) => {
          // If we have a heading, the first block (idx=0) should not have top margin
          // because the heading already has bottom margin. Other blocks need spacing.
          const hasTopMargin = headingText ? idx > 0 : idx > 0;
          return renderBlock(block, idx, hasTopMargin);
        })}

        {/* Arrow pointer pointing up to the icon */}
        <span
          className="absolute left-1/2 bottom-full -translate-x-1/2 border-4 border-transparent border-b-gray-900/95"
          aria-hidden="true"
        />
      </span>
    </span>
  );
}
