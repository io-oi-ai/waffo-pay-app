export function formatCurrency(
  amount: number,
  currency: string = "JPY",
  locale = "ja-JP"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(amount);
}

export function formatBonus(base: number, bonus?: number) {
  if (!bonus || base === 0) return undefined;
  return Math.round((bonus / base) * 100);
}
