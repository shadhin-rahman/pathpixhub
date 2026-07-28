const BLOCKED_COUNTRIES = [
  "BD",
  "IN",
  "NG",
  "PK",
  "LK",
  "NP",
  "KE",
  "GH",
  "ET",
  "UG",
  "TZ",
  "ZW",
  "MM",
  "YE",
  "SD",
  "AF",
];

const ADMIN_SECRET = "pph2024admin";
const BYPASS_KEY = "pph_bypass";
const COUNTRY_KEY = "pph_country_code";

export function getBypassCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(BYPASS_KEY);
}

export function setBypassCode(code: string): void {
  localStorage.setItem(BYPASS_KEY, code);
}

export function isAdmin(): boolean {
  return getBypassCode() === ADMIN_SECRET;
}

export function fetchCountryCode(): Promise<string | null> {
  const cached = typeof window !== "undefined" ? localStorage.getItem(COUNTRY_KEY) : null;
  if (cached) return Promise.resolve(cached);

  return fetch("https://ip-api.com/json/?fields=countryCode", { cache: "no-store" })
    .then((r) => r.json())
    .then((data) => {
      const code: string | undefined = data?.countryCode;
      if (code && typeof window !== "undefined") {
        localStorage.setItem(COUNTRY_KEY, code);
      }
      return code ?? null;
    })
    .catch(() => null);
}

export function isCountryBlocked(countryCode: string | null): boolean {
  if (!countryCode) return false;
  if (isAdmin()) return false;
  return BLOCKED_COUNTRIES.includes(countryCode.toUpperCase());
}
