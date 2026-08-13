// Sequential order/quote reference like Q1001, Q1002…
// The number comes from a Postgres sequence (public.quote_no_seq, start 1001)
// via the next_quote_no() RPC, so no two customers ever get the same code.

export const ORDER_REF_PREFIX = "Q";
export const ORDER_NO_PREFIX = "ORD";

export function formatOrderRef(num: number): string {
  return `${ORDER_REF_PREFIX}${num}`;
}

export function formatOrderNo(num: number): string {
  return `${ORDER_NO_PREFIX}-${num}`;
}

export function isOrderRef(value: string): boolean {
  const v = value.trim().toUpperCase();
  return (
    /^Q\d+$/.test(v) ||
    /^PPX-[A-HJ-NP-Z2-9]{6}$/.test(v)
  );
}