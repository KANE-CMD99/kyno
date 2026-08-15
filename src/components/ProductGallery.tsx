"use client";

import { useState } from "react";

interface Props {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: Props) {
  const safe = images.filter(Boolean).slice(0, 3);
  const [active, setActive] = useState(0);
  const current = safe[Math.min(active, safe.length - 1)];

  if (safe.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[4/3] rounded-lg sm:rounded-xl bg-neutral-100 overflow-hidden">
        <img
          src={current}
          alt={`${name} — preview ${active + 1}`}
          className="h-full w-full object-cover"
        />
      </div>

      {safe.length > 1 && (
        <div className="flex gap-2 sm:gap-3">
          {safe.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={`relative aspect-[4/3] w-20 sm:w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === active
                  ? "border-blue-600 ring-1 ring-blue-600"
                  : "border-transparent opacity-70 hover:opacity-100 hover:border-neutral-300"
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
