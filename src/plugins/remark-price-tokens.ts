import { fillPrices } from "../lib/prices";

/** Replace {{price.*}} tokens in markdown text, links, raw HTML and frontmatter. */
const fillDeep = (v: any): any =>
  typeof v === "string" ? fillPrices(v) : Array.isArray(v) ? v.map(fillDeep)
  : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fillDeep(x)])) : v;

export default function remarkPriceTokens() {
  return (tree: any, file: any) => {
    const walk = (n: any) => {
      if (typeof n.value === "string") n.value = fillPrices(n.value);
      if (typeof n.url === "string") n.url = fillPrices(n.url);
      if (typeof n.title === "string") n.title = fillPrices(n.title);
      n.children?.forEach(walk);
    };
    walk(tree);
    const fm = file?.data?.astro?.frontmatter;
    if (fm) for (const k of Object.keys(fm)) fm[k] = fillDeep(fm[k]);
  };
}
