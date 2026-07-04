/**
 * Formatting helpers — Singapore-first.
 * All money in the app is stored as a plain number of SGD (dollars).
 */

export function formatSGD(
  amount: number,
  opts: { decimals?: boolean; sign?: boolean } = {},
): string {
  const { decimals = false, sign = false } = opts;
  const formatted = new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(Math.abs(amount));

  if (sign && amount !== 0) {
    return `${amount > 0 ? "+" : "−"}${formatted}`;
  }
  return amount < 0 ? `−${formatted}` : formatted;
}

/** Compact money, e.g. $1.2k, $45k, $1.1M — for large net-worth figures. */
export function formatSGDCompact(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "−" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `${sign}$${Math.round(abs / 1_000)}k`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}k`;
  return `${sign}$${Math.round(abs)}`;
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatMonthShort(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-SG", { month: "short" });
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Short relative time, e.g. "now", "3h", "2d", "5w". */
export function formatRelative(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  const mins = Math.floor((Date.now() - then) / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

/** Clamp a number into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
