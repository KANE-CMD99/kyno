"use client";

import { useState } from "react";

interface Props {
  description: string;
}

const COLLAPSE_LENGTH = 200;

export default function ProductDescription({ description }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > COLLAPSE_LENGTH;

  if (!isLong) {
    return (
      <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">
        {description}
      </p>
    );
  }

  return (
    <div className="relative">
      <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-600">
        {expanded ? description : `${description.slice(0, COLLAPSE_LENGTH).trimEnd()}…`}
      </p>
      {!expanded && (
        <div className="pointer-events-none absolute inset-x-0 bottom-5 h-14 bg-gradient-to-t from-white via-white/70 to-transparent" />
      )}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
