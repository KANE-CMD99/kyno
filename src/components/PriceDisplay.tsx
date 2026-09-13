"use client";

import { useCurrency } from "./CurrencyContext";

interface Props {
  price: number;
  originalPrice?: number;
  className?: string;
  originalClassName?: string;
}

export default function PriceDisplay({ price, originalPrice, className, originalClassName }: Props) {
  const { format } = useCurrency();
  // A "was/was not" price only makes sense for something actually on sale:
  // never for free items, and never when it wouldn't be a real discount.
  const hasSale = !!originalPrice && originalPrice > price && price > 0;
  const discount = hasSale ? Math.round((1 - price / originalPrice) * 100) : 0;

  return (
    <>
      <span className={className}>{format(price)}</span>
      {hasSale && (
        <>
          <span className={originalClassName}>{format(originalPrice)}</span>
          {discount > 0 && (
            <span className="rounded bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
              {discount}% OFF
            </span>
          )}
        </>
      )}
    </>
  );
}
