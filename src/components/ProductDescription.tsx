"use client";

import { useState } from "react";

interface Props {
  description: string;
}

const COLLAPSE_LENGTH = 280;

export default function ProductDescription({ description }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > COLLAPSE_LENGTH;

  const displayText =
    !isLong || expanded
      ? description
      : `${description.slice(0, COLLAPSE_LENGTH).trimEnd()}…`;

  return (
    <div>
      <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">
        {displayText}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
