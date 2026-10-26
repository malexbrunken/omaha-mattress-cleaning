/**
 * The one place prices live. Pages and schema read from here, so a price or
 * promo change is a single edit.
 *
 * Pricing rule (2026-10-25, replaces the 2026-10-04 "/pricing only" rule):
 * - While PROMO.active is true, every page that shows the first-mattress price
 *   shows the regular price struck through beside the promo price
 *   (priceText.firstHtml in templates/markdown, priceText.first in plain text).
 * - The rebook offer and PromoBlock stay on /pricing.
 * - Set `active: false` and the whole site falls back to PRICES.first.
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

export const firstPrice = {
  promo: PROMO.active,
  regular: PRICES.first,
  current: PROMO.active ? PROMO.first : PRICES.first,
} as const;

export const priceText = {
  /** Plain text (meta, schema, FAQ strings). */
  first: PROMO.active ? `${usd(PROMO.first)} (Fall 2026 promo, regularly ${usd(PRICES.first)})` : usd(PRICES.first),
  /** Visible HTML with the regular price struck through. Use with set:html. */
  firstHtml: PROMO.active
    ? `<span class="sr-only">${usd(PROMO.first)}, Fall 2026 promo (regular price ${usd(PRICES.first)})</span><span aria-hidden="true"><s style="opacity:.6;font-weight:400">${usd(PRICES.first)}</s> ${usd(PROMO.first)} <small style="font-size:.7em">Fall 2026 promo</small></span>`
    : usd(PRICES.first),
  firstRegular: usd(PRICES.first),
  firstCurrent: usd(PROMO.active ? PROMO.first : PRICES.first),
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
        const v = k === "first" ? firstPrice.current : (PRICES as any)[k];
        if (typeof v !== "number") throw new Error(`Unknown price in token ${m}`);
        return t + v;
      }, 0));
    }
    if (key === "firstHtml") throw new Error("firstHtml is not a markdown token");
    const v = (priceText as any)[key];
    if (typeof v !== "string") throw new Error(`Unknown price token ${m}`);
    return v;
  });
}
