export type Currency = "INR" | "USD";

const STORAGE_KEY = "liklet:currency";

function safeLower(s: unknown) {
  return String(s || "").toLowerCase();
}

export function formatMoney(amount: number, currency: Currency, locale?: string) {
  const normalized = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat(locale || undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "INR" ? 0 : 2,
    }).format(normalized);
  } catch {
    return currency === "INR" ? `₹${Math.round(normalized)}` : `$${normalized.toFixed(2)}`;
  }
}

export function getFxInrToUsd() {
  const raw = (import.meta.env.VITE_FX_INR_TO_USD as string | undefined) || "";
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 0.012;
}

export function inrToUsd(inr: number) {
  return Number(inr || 0) * getFxInrToUsd();
}

export function getStoredCurrency(): Currency | null {
  const raw = safeLower(localStorage.getItem(STORAGE_KEY));
  if (raw === "inr") return "INR";
  if (raw === "usd") return "USD";
  return null;
}

export async function detectCurrency(): Promise<Currency> {
  const cached = getStoredCurrency();
  if (cached) return cached;

  try {
    const res = await fetch("https://ipwho.is/", { method: "GET" });
    const data = (await res.json()) as { country_code?: string; success?: boolean };
    const countryCode = safeLower(data.country_code);
    const currency: Currency = countryCode === "in" ? "INR" : "USD";
    localStorage.setItem(STORAGE_KEY, currency);
    return currency;
  } catch {
    const lang = safeLower(navigator.language);
    const tz = safeLower(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const isIndia = lang.endsWith("-in") || tz.includes("kolkata") || tz.includes("calcutta");
    const currency: Currency = isIndia ? "INR" : "USD";
    localStorage.setItem(STORAGE_KEY, currency);
    return currency;
  }
}

