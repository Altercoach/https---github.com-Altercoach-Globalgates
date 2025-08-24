import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Currency } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currency: Currency
) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.code,
  }).format(amount * currency.rate);
}
