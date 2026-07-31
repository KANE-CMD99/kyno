"use client";

import { useCart } from "./CartContext";
import { useCurrency } from "./CurrencyContext";

interface AddToCartButtonProps {
  id: string;
  name: string;
  price: number;
  category: string;
  className?: string;
}

export default function AddToCartButton({ id, name, price, category, className }: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
  const { format } = useCurrency();

  return (
    <button
      onClick={() => { addItem({ id, name, price, category }); openCart(); }}
      className={className}
    >
      Add to Cart — {format(price)}
    </button>
  );
}
