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
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

  return (
    <>
      <span className={className}>{format(price)}</span>
      {originalPrice && (
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
