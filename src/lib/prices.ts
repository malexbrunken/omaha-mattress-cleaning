/**
 * The one place prices live. Pages and schema read from here, so a price or
 * promo change is a single edit.
 *
 * Pricing rule (2026-10-04):
 * - Everywhere except the pricing section on the home page (/#pricing, this site's
 *   pricing page), the first mattress is PRICES.first. No promo, no crossed-out
 *   price, no rebook offer.
 * - Additional-mattress and underside rates may appear anywhere, always labelled
 *   as additional.
 * - PROMO is shown only inside the /#pricing section and its Offer schema. Set
 *   `active: false` to switch it off there too.
 */
export const PRICES = {
  first: 249,
  additionalLarge: 199, // each additional full, queen or king, same visit
  additionalKids: 149, // each additional kids bed (twin/full), same visit
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
  additionalLarge: usd(PRICES.additionalLarge),
  additionalKids: usd(PRICES.additionalKids),
  additionalRange: `${usd(PRICES.additionalKids)}–${usd(PRICES.additionalLarge)}`,
  underside: `+${usd(PRICES.underside.min)}–${usd(PRICES.underside.max)}`,
  promoFirst: usd(PROMO.first),
  promoFollowUp: `Book another cleaning within ${PROMO.rebookDays} days of your service and it's also ${usd(PROMO.rebookPrice)}.`,
} as const;
