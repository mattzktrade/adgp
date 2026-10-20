export type PhoneCountry = {
  iso: string;
  name: string;
  dial: string;
  placeholder: string;
};

const FEATURED_ISOS = ["AE", "GB", "SA", "QA", "KW", "BH", "OM", "IN", "US", "DE", "FR", "IT", "AU"] as const;

const ALL_COUNTRIES: PhoneCountry[] = [
  { iso: "AE", name: "United Arab Emirates", dial: "971", placeholder: "50 123 4567" },
  { iso: "AU", name: "Australia", dial: "61", placeholder: "412 345 678" },
  { iso: "AT", name: "Austria", dial: "43", placeholder: "664 123456" },
  { iso: "BH", name: "Bahrain", dial: "973", placeholder: "3600 1234" },
  { iso: "BE", name: "Belgium", dial: "32", placeholder: "470 12 34 56" },
  { iso: "BR", name: "Brazil", dial: "55", placeholder: "11 91234 5678" },
  { iso: "CA", name: "Canada", dial: "1", placeholder: "416 555 0123" },
  { iso: "CN", name: "China", dial: "86", placeholder: "131 2345 6789" },
  { iso: "CZ", name: "Czechia", dial: "420", placeholder: "601 123 456" },
  { iso: "DK", name: "Denmark", dial: "45", placeholder: "20 12 34 56" },
  { iso: "EG", name: "Egypt", dial: "20", placeholder: "100 123 4567" },
  { iso: "FI", name: "Finland", dial: "358", placeholder: "40 123 4567" },
  { iso: "FR", name: "France", dial: "33", placeholder: "6 12 34 56 78" },
  { iso: "DE", name: "Germany", dial: "49", placeholder: "1512 3456789" },
  { iso: "GR", name: "Greece", dial: "30", placeholder: "691 234 5678" },
  { iso: "HK", name: "Hong Kong", dial: "852", placeholder: "5123 4567" },
  { iso: "HU", name: "Hungary", dial: "36", placeholder: "20 123 4567" },
  { iso: "IN", name: "India", dial: "91", placeholder: "81234 56789" },
  { iso: "IE", name: "Ireland", dial: "353", placeholder: "85 123 4567" },
  { iso: "IT", name: "Italy", dial: "39", placeholder: "312 345 6789" },
  { iso: "JP", name: "Japan", dial: "81", placeholder: "90 1234 5678" },
  { iso: "KW", name: "Kuwait", dial: "965", placeholder: "5000 1234" },
  { iso: "MY", name: "Malaysia", dial: "60", placeholder: "12 345 6789" },
  { iso: "MX", name: "Mexico", dial: "52", placeholder: "55 1234 5678" },
  { iso: "MC", name: "Monaco", dial: "377", placeholder: "6 12 34 56 78" },
  { iso: "NL", name: "Netherlands", dial: "31", placeholder: "6 12345678" },
  { iso: "NZ", name: "New Zealand", dial: "64", placeholder: "21 123 4567" },
  { iso: "NO", name: "Norway", dial: "47", placeholder: "406 12 345" },
  { iso: "OM", name: "Oman", dial: "968", placeholder: "9212 3456" },
  { iso: "PL", name: "Poland", dial: "48", placeholder: "512 345 678" },
  { iso: "PT", name: "Portugal", dial: "351", placeholder: "912 345 678" },
  { iso: "QA", name: "Qatar", dial: "974", placeholder: "3312 3456" },
  { iso: "RU", name: "Russia", dial: "7", placeholder: "912 345 67 89" },
  { iso: "SA", name: "Saudi Arabia", dial: "966", placeholder: "50 123 4567" },
  { iso: "SG", name: "Singapore", dial: "65", placeholder: "8123 4567" },
  { iso: "ZA", name: "South Africa", dial: "27", placeholder: "82 123 4567" },
  { iso: "KR", name: "South Korea", dial: "82", placeholder: "10 1234 5678" },
  { iso: "ES", name: "Spain", dial: "34", placeholder: "612 34 56 78" },
  { iso: "SE", name: "Sweden", dial: "46", placeholder: "70 123 45 67" },
  { iso: "CH", name: "Switzerland", dial: "41", placeholder: "78 123 45 67" },
  { iso: "TR", name: "Turkey", dial: "90", placeholder: "501 234 56 78" },
  { iso: "GB", name: "United Kingdom", dial: "44", placeholder: "7700 900123" },
  { iso: "US", name: "United States", dial: "1", placeholder: "201 555 0123" },
];

const byIso = new Map(ALL_COUNTRIES.map((country) => [country.iso, country]));

export const DEFAULT_PHONE_COUNTRY_ISO = "AE";

const FEATURED_ISO_SET = new Set<string>(FEATURED_ISOS);

export const FEATURED_PHONE_COUNTRIES: PhoneCountry[] = FEATURED_ISOS.map((iso) => byIso.get(iso)!);

export const OTHER_PHONE_COUNTRIES: PhoneCountry[] = ALL_COUNTRIES.filter(
  (country) => !FEATURED_ISO_SET.has(country.iso),
).sort((a, b) => a.name.localeCompare(b.name));

export const PHONE_COUNTRIES: PhoneCountry[] = [...FEATURED_PHONE_COUNTRIES, ...OTHER_PHONE_COUNTRIES];

const SEARCH_ALIASES: Record<string, string> = {
  AE: "UAE Emirates Dubai",
  GB: "UK Britain England",
  US: "USA America",
  SA: "KSA",
  KR: "Korea",
};

export function phoneCountrySearchValue(country: PhoneCountry): string {
  return [country.name, country.iso, `+${country.dial}`, country.dial, SEARCH_ALIASES[country.iso] ?? ""]
    .join(" ")
    .trim();
}

export function phoneCountry(iso: string): PhoneCountry {
  return byIso.get(iso) ?? byIso.get(DEFAULT_PHONE_COUNTRY_ISO)!;
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Longest matching dial code, so +971 wins over +9. */
export function matchCountryFromDigits(digits: string): PhoneCountry | undefined {
  return [...ALL_COUNTRIES]
    .sort((a, b) => b.dial.length - a.dial.length)
    .find((country) => digits.startsWith(country.dial) && digits.length > country.dial.length);
}

/**
 * Build an E.164 number from a selected country and whatever the guest typed.
 * Drops a leading 0 on the local number, and does not double the country code
 * if they pasted an international number.
 */
export function buildE164(dial: string, national: string): string | null {
  const trimmed = national.trim();
  if (!trimmed) return null;

  let digits = digitsOnly(trimmed);
  if (!digits) return null;

  const pastedInternational = trimmed.startsWith("+") || trimmed.startsWith("00");
  if (pastedInternational) {
    if (digits.startsWith("00")) digits = digits.slice(2);
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  }

  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.startsWith(dial) && digits.length - dial.length >= 6) {
    digits = digits.slice(dial.length);
  }

  const combined = `${dial}${digits}`;
  if (combined.length < 8 || combined.length > 15) return null;
  return `+${combined}`;
}
