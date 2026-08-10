// Generates a short, human-readable order/quote reference like PPX-8F3K2A.
// Used so customers can identify their quote/order by number.

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity

function randomSegment(len: number): string {
  let out = "";
  const cryptoObj =
    typeof crypto !== "undefined" ? crypto : (globalThis as { crypto?: Crypto }).crypto;
  const values =
    cryptoObj?.getRandomValues?.(new Uint8Array(len)) ??
    Array.from({ length: len }, () => Math.floor(Math.random() * 256));

  for (let i = 0; i < len; i++) {
    out += ALPHABET[values[i] % ALPHABET.length];
  }
  return out;
}

export function generateOrderRef(): string {
  return `PPX-${randomSegment(6)}`;
}

export function isOrderRef(value: string): boolean {
  return /^PPX-[A-HJ-NP-Z2-9]{6}$/.test(value.trim().toUpperCase());
}
