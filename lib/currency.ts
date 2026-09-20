import { CurrencyCode } from "./types";

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  ZMW: "K",
  USD: "$",
  ZAR: "R",
};

export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  ZMW: "Zambian Kwacha (ZMW)",
  USD: "US Dollar (USD)",
  ZAR: "South African Rand (ZAR)",
};

export function formatMoney(amount: number, currency: CurrencyCode = "ZMW") {
  const symbol = CURRENCY_SYMBOLS[currency];
  const rounded = Math.round(amount * 100) / 100;
  const formatted = rounded.toLocaleString("en-ZM", {
    minimumFractionDigits: rounded % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}

export function formatMoneyExact(amount: number, currency: CurrencyCode = "ZMW") {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = amount.toLocaleString("en-ZM", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}
