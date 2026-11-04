const CURRENCY_SYMBOL = "৳";

export function formatMoney(value, decimals = 2) {
  const amount = Number(value) || 0;
  return `${CURRENCY_SYMBOL} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatNumber(value) {
  return (Number(value) || 0).toLocaleString("en-US");
}

export function formatDate(isoDate) {
  if (!isoDate) return "—";
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return String(isoDate);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatMonth(month) {
  if (!month) return "—";
  const [year, monthNumber] = month.split("-");
  const date = new Date(Number(year), Number(monthNumber) - 1, 1);
  if (Number.isNaN(date.getTime())) return String(month);
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
