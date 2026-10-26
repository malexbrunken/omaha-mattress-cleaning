/**
 * The one place prices live. Pages and schema read from here, so a price or
 * promo change is a single edit.
 *
 * Pricing rule (2026-10-04):
 * - Everywhere except /pricing, the first mattress is PRICES.first. No promo,
 *   no crossed-out price, no rebook offer.
 * - Additional-mattress and underside rates may appear anywhere, always labelled
 *   as additional.
 * - PROMO is shown only on /pricing (src/components/PromoBlock.astro) and in that
 *   page's Offer schema. Set `active: false` to switch it off there too.
 */
export const PRICES = {
  first: 249,
  additionalKing: 199, // each additional king or California king, same visit
  additionalFullQueen: 179, // each additional full or queen, same visit
  additionalKids: 149, // each additional twin or kids bed, same visit
  underside: { min: 50, max: 75 }, // underside/full-surface treatment, per mattress
} as const;

export const PROMO = {
  active: true,
  label: "Fall 2026 promotion",
  badge: "Limited-time Fall 2026 offer",
  first: 199,
  rebookDays: 7,
  rebookPrice: 199,
} as const;

export const usd = (n: number) => `$${n}`;

export const priceText = {
  first: usd(PRICES.first),
  additionalKing: usd(PRICES.additionalKing),
  additionalFullQueen: usd(PRICES.additionalFullQueen),
  additionalKids: usd(PRICES.additionalKids),
  additionalRange: `${usd(PRICES.additionalKids)}–${usd(PRICES.additionalKing)}`,
  undersideRange: `${usd(PRICES.underside.min)}–${usd(PRICES.underside.max)}`,
  underside: `+${usd(PRICES.underside.min)}–${usd(PRICES.underside.max)}`,
  promoFirst: usd(PROMO.first),
  promoFollowUp: `Book another cleaning within ${PROMO.rebookDays} days of your service and it's also ${usd(PROMO.rebookPrice)}.`,
} as const;

/**
 * Fill {{price.key}} and {{price.sum:a+b+c}} tokens (used in .md pages via the
 * remark plugin in astro.config.mjs) from PRICES/priceText, so markdown never
 * hardcodes a price.
 */
export function fillPrices(raw: string): string {
  return raw.replace(/\{\{price\.([a-zA-Z]+)(?::([a-zA-Z+]+))?\}\}/g, (m, key: string, expr?: string) => {
    if (key === "sum" && expr) {
      return usd(expr.split("+").reduce((t, k) => {
        const v = (PRICES as any)[k];
        if (typeof v !== "number") throw new Error(`Unknown price in token ${m}`);
        return t + v;
      }, 0));
    }
    const v = (priceText as any)[key];
    if (typeof v !== "string") throw new Error(`Unknown price token ${m}`);
    return v;
  });
}
