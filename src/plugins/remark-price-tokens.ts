import { fillPrices, priceText } from "../lib/prices";

/** Replace {{price.*}} tokens in markdown text, links, raw HTML and frontmatter.
 * In body text, {{price.first}} becomes the struck-through promo HTML (priceText.firstHtml);
 * frontmatter, URLs and titles get the plain-text version. */
const fillDeep = (v: any): any =>
  typeof v === "string" ? fillPrices(v) : Array.isArray(v) ? v.map(fillDeep)
  : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fillDeep(x)])) : v;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const FIRST = "{{price.first}}";

export default function remarkPriceTokens() {
  return (tree: any, file: any) => {
    const walk = (n: any) => {
      if (n.type === "text" && typeof n.value === "string" && n.value.includes(FIRST)) {
        n.type = "html";
        n.value = n.value.split(FIRST).map((part: string) => esc(fillPrices(part))).join(priceText.firstHtml);
      } else if (n.type === "html" && typeof n.value === "string") {
        n.value = fillPrices(n.value.split(FIRST).join(priceText.firstHtml));
      } else if (typeof n.value === "string") n.value = fillPrices(n.value);
      if (typeof n.url === "string") n.url = fillPrices(n.url);
      if (typeof n.title === "string") n.title = fillPrices(n.title);
      n.children?.forEach(walk);
    };
    walk(tree);
    const fm = file?.data?.astro?.frontmatter;
    if (fm) for (const k of Object.keys(fm)) fm[k] = fillDeep(fm[k]);
  };
}
