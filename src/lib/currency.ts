// Approximate exchange rates vs USD (updated 2026-07-31)
// Used for display only — actual payment is processed by Stripe in USD

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rate: number; // 1 USD = ? of this currency
}

const currencies: Record<string, CurrencyInfo> = {
  US: { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  CN: { code: "CNY", symbol: "¥", name: "人民币", rate: 7.28 },
  JP: { code: "JPY", symbol: "¥", name: "日本円", rate: 149 },
  KR: { code: "KRW", symbol: "₩", name: "대한민국 원", rate: 1380 },
  GB: { code: "GBP", symbol: "£", name: "Pound Sterling", rate: 0.79 },
  DE: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  FR: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  IT: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  ES: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  NL: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  BE: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  AT: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  PT: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  FI: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  IE: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  GR: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  CA: { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.38 },
  AU: { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.52 },
  NZ: { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", rate: 1.65 },
  IN: { code: "INR", symbol: "₹", name: "भारतीय रुपया", rate: 83.5 },
  BR: { code: "BRL", symbol: "R$", name: "Real", rate: 5.65 },
  MX: { code: "MXN", symbol: "MX$", name: "Peso Mexicano", rate: 18.6 },
  SG: { code: "SGD", symbol: "S$", name: "Singapore Dollar", rate: 1.34 },
  HK: { code: "HKD", symbol: "HK$", name: "港元", rate: 7.82 },
  TW: { code: "TWD", symbol: "NT$", name: "新台幣", rate: 32.5 },
  TH: { code: "THB", symbol: "฿", name: "บาท", rate: 35.8 },
  VN: { code: "VND", symbol: "₫", name: "đồng", rate: 25600 },
  PH: { code: "PHP", symbol: "₱", name: "Piso", rate: 57.2 },
  MY: { code: "MYR", symbol: "RM", name: "Ringgit", rate: 4.55 },
  ID: { code: "IDR", symbol: "Rp", name: "Rupiah", rate: 16400 },
  RU: { code: "RUB", symbol: "₽", name: "Рубль", rate: 86 },
  AE: { code: "AED", symbol: "د.إ", name: "درهم", rate: 3.67 },
  SA: { code: "SAR", symbol: "﷼", name: "ريال", rate: 3.75 },
};

export function getCurrency(countryCode: string): CurrencyInfo {
  return currencies[countryCode] || currencies.US;
}

export function convertPrice(usdPrice: number, currency: CurrencyInfo): number {
  return Math.round(usdPrice * currency.rate * 100) / 100;
}

export function formatPrice(amount: number, currency: CurrencyInfo): string {
  if (currency.code === "JPY" || currency.code === "KRW" || currency.code === "VND" || currency.code === "IDR") {
    // These currencies don't use decimal places
    return `${currency.symbol}${Math.round(amount).toLocaleString()}`;
  }
  return `${currency.symbol}${amount.toFixed(2)}`;
}
