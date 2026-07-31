"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/components/CartContext";
import { LangProvider } from "@/components/LangContext";
import { CurrencyProvider } from "@/components/CurrencyContext";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <CurrencyProvider>
        <CartProvider>{children}</CartProvider>
      </CurrencyProvider>
    </LangProvider>
  );
}
