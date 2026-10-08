"use client";

import { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { CartProvider } from "@/components/CartContext";
import { LangProvider } from "@/components/LangContext";
import { CurrencyProvider } from "@/components/CurrencyContext";
import VisitTracker from "@/components/VisitTracker";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    // reducedMotion="user" makes every framer-motion animation below honour the
    // OS "reduce motion" setting. A CSS media query cannot do that — these
    // animations are driven by inline styles, not CSS transitions.
    <MotionConfig reducedMotion="user">
      <LangProvider>
        <CurrencyProvider>
          <CartProvider>
            <VisitTracker />
            {children}
          </CartProvider>
        </CurrencyProvider>
      </LangProvider>
    </MotionConfig>
  );
}
