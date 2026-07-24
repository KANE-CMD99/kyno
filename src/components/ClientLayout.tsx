"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/components/CartContext";
import { LangProvider } from "@/components/LangContext";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <CartProvider>{children}</CartProvider>
    </LangProvider>
  );
}
