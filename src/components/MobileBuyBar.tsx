"use client";

import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import PriceDisplay from "./PriceDisplay";

interface Props {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
}

export default function MobileBuyBar({ id, name, price, originalPrice, category }: Props) {
  const isFree = price === 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex shrink-0 items-center gap-2">
          {isFree ? (
            <span className="text-lg font-bold text-emerald-600">Free</span>
          ) : (
            <PriceDisplay
              price={price}
              originalPrice={originalPrice}
              className="text-lg font-bold text-neutral-900"
              originalClassName="text-sm text-neutral-400 line-through"
            />
          )}
        </div>
        {isFree ? (
          <Link
            href="/free-downloads"
            className="flex-1 rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Download Free
          </Link>
        ) : (
          <AddToCartButton
            id={id}
            name={name}
            price={price}
            category={category}
            className="flex-1 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          />
        )}
      </div>
    </div>
  );
}
