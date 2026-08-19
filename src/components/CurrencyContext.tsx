"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getCurrency, convertPrice, formatPrice, type CurrencyInfo } from "@/lib/currency";

interface CurrencyContextType {
  currency: CurrencyInfo;
  convert: (usdPrice: number) => number;
  format: (usdPrice: number) => string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  convert: (p) => p,
  format: (p) => `$${p.toFixed(2)}`,
  loading: true,
});

let cachedCountry = "";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyInfo>({ code: "USD", symbol: "$", name: "US Dollar", rate: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cachedCountry) {
      setCurrency(getCurrency(cachedCountry));
      setLoading(false);
      return;
    }

    fetch("https://ip-api.com/json/?fields=countryCode")
      .then((r) => r.json())
      .then((data) => {
        cachedCountry = data.countryCode || "US";
        setCurrency(getCurrency(cachedCountry));
      })
      .catch(() => {
        cachedCountry = "US";
        setCurrency(getCurrency("US"));
      })
      .finally(() => setLoading(false));
  }, []);

  const convert = useCallback((usdPrice: number) => convertPrice(usdPrice, currency), [currency]);
  const format = useCallback((usdPrice: number) => formatPrice(convertPrice(usdPrice, currency), currency), [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, convert, format, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
