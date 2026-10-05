import type { APIRoute } from "astro";
import { guideLastmod, kcLastmod, pageLastmod, type Layout } from "../lib/lastmod";

const SITE = "https://omahamattresscleaning.com";
const STATIC = ["/", "/pricing", "/about", "/book"].map((path) => ({ path, lastmod: pageLastmod(path) }));
const KC_GUIDES = import.meta.glob<Fm>(["./omaha-homes/*.md", "./areas/*.md", "./allergy-season/*.md", "./airbnb-hosts/*.md", "./developments/*.md", "./compare/*.md"], { eager: true });

type Fm = { frontmatter?: { updated?: string; published?: string; draft?: boolean } };
const hub = import.meta.glob<Fm>("./omaha-homes.astro", { eager: true });
const guides = import.meta.glob<Fm>("./omaha-homes/*.md", { eager: true });
const areaHub = import.meta.glob<Fm>("./areas.astro", { eager: true });
const areas = import.meta.glob<Fm>("./areas/*.md", { eager: true });
const allergyHub = import.meta.glob<Fm>("./allergy-season.astro", { eager: true });
const allergy = import.meta.glob<Fm>("./allergy-season/*.md", { eager: true });
const hostHub = import.meta.glob<Fm>("./airbnb-hosts.astro", { eager: true });
const hosts = import.meta.glob<Fm>("./airbnb-hosts/*.md", { eager: true });
const devHub = import.meta.glob<Fm>("./developments.astro", { eager: true });
const developments = import.meta.glob<Fm>("./developments/*.md", { eager: true });
const compareHub = import.meta.glob<Fm>("./compare.astro", { eager: true });
const compares = import.meta.glob<Fm>("./compare/*.md", { eager: true });

export const GET: APIRoute = () => {
  const entries = [...STATIC];
  const kcGuides = Object.values(KC_GUIDES).map((m) => m.frontmatter ?? {}).filter((f) => !f.draft);
  entries.push({ path: "/knowledge-center", lastmod: kcLastmod(kcGuides) });
  if (Object.keys(hub).length) entries.push({ path: "/omaha-homes", lastmod: pageLastmod("/omaha-homes") });
  for (const [file, mod] of Object.entries(guides)) {
    const fm = mod.frontmatter ?? {};
    if (fm.draft) continue;
    const slug = file.replace("./omaha-homes/", "").replace(/\.md$/, "");
    entries.push({ path: `/omaha-homes/${slug}`, lastmod: guideLastmod(fm, "OmahaGuide" as Layout) });
  }
  if (Object.keys(areaHub).length) entries.push({ path: "/areas", lastmod: pageLastmod("/areas") });
  for (const [file, mod] of Object.entries(areas)) {
    const fm = mod.frontmatter ?? {};
    if (fm.draft) continue;
    const slug = file.replace("./areas/", "").replace(/\.md$/, "");
    entries.push({ path: `/areas/${slug}`, lastmod: guideLastmod(fm, "AreaPage" as Layout) });
  }
  if (Object.keys(allergyHub).length) entries.push({ path: "/allergy-season", lastmod: pageLastmod("/allergy-season") });
  for (const [file, mod] of Object.entries(allergy)) {
    const fm = mod.frontmatter ?? {};
    if (fm.draft) continue;
    const slug = file.replace("./allergy-season/", "").replace(/\.md$/, "");
    entries.push({ path: `/allergy-season/${slug}`, lastmod: guideLastmod(fm, "SeasonGuide" as Layout) });
  }
  if (Object.keys(hostHub).length) entries.push({ path: "/airbnb-hosts", lastmod: pageLastmod("/airbnb-hosts") });
  for (const [file, mod] of Object.entries(hosts)) {
    const fm = mod.frontmatter ?? {};
    if (fm.draft) continue;
    const slug = file.replace("./airbnb-hosts/", "").replace(/\.md$/, "");
    entries.push({ path: `/airbnb-hosts/${slug}`, lastmod: guideLastmod(fm, "HostBrief" as Layout) });
  }
  if (Object.keys(devHub).length) entries.push({ path: "/developments", lastmod: pageLastmod("/developments") });
  for (const [file, mod] of Object.entries(developments)) {
    const fm = mod.frontmatter ?? {};
    if (fm.draft) continue;
    const slug = file.replace("./developments/", "").replace(/\.md$/, "");
    entries.push({ path: `/developments/${slug}`, lastmod: guideLastmod(fm, "DevelopmentGuide" as Layout) });
  }
  if (Object.keys(compareHub).length) entries.push({ path: "/compare", lastmod: pageLastmod("/compare") });
  for (const [file, mod] of Object.entries(compares)) {
    const fm = mod.frontmatter ?? {};
    if (fm.draft) continue;
    const slug = file.replace("./compare/", "").replace(/\.md$/, "");
    entries.push({ path: `/compare/${slug}`, lastmod: guideLastmod(fm, "CompareGuide" as Layout) });
  }
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.map((e) => `  <url><loc>${SITE}${e.path === "/" ? "/" : e.path}</loc><lastmod>${e.lastmod}</lastmod></url>`).join("\n") +
    `\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
