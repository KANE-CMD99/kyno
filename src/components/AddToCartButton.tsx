"use client";

import { useCart } from "./CartContext";

interface AddToCartButtonProps {
  id: string;
  name: string;
  price: number;
  category: string;
  className?: string;
}

export default function AddToCartButton({ id, name, price, category, className }: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();

  return (
    <button
      onClick={() => { addItem({ id, name, price, category }); openCart(); }}
      className={className}
    >
      Add to Cart — ${price}
    </button>
  );
}
