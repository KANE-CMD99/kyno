"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/components/CartContext";
import { LangProvider } from "@/components/LangContext";
import { CurrencyProvider } from "@/components/CurrencyContext";
import VisitTracker from "@/components/VisitTracker";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <CurrencyProvider>
        <CartProvider>
          <VisitTracker />
          {children}
        </CartProvider>
      </CurrencyProvider>
    </LangProvider>
  );
}
