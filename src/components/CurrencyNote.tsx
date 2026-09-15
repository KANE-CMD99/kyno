"use client";

import { useCurrency } from "./CurrencyContext";

/**
 * Prices are converted for display only — Stripe always charges USD. We show
 * the converted figure as a convenience, so say plainly which currency is
 * actually charged rather than letting it be a surprise on the statement.
 */
export default function CurrencyNote({ className = "" }: { className?: string }) {
  const { currency, loading } = useCurrency();
  if (loading || currency.code === "USD") return null;
  return (
    <p className={`text-xs text-neutral-400 ${className}`}>
      Converted for reference — you&apos;ll be charged in USD.
    </p>
  );
}
