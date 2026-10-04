import type { APIRoute } from "astro";

const SITE = "https://omahamattresscleaning.com";
/** Last substantive edit of each fixed page. Bump a date only when that page's content really changes. */
const STATIC: { path: string; lastmod: string }[] = [
  { path: "/", lastmod: "2026-10-04" },
  { path: "/pricing", lastmod: "2026-10-04" },
  { path: "/about", lastmod: "2026-10-04" },
  { path: "/book", lastmod: "2026-10-04" },
];
/** Last substantive edit of each hub page. */
const HUB_LASTMOD: Record<string, string> = {
  "/omaha-homes": "2026-10-04",
  "/areas": "2026-10-04",
  "/allergy-season": "2026-10-04",
  "/airbnb-hosts": "2026-10-04",
};

type Fm = { frontmatter?: { updated?: string; published?: string; draft?: boolean } };
const hub = import.meta.glob<Fm>("./omaha-homes.astro", { eager: true });
const guides = import.meta.glob<Fm>("./omaha-homes/*.md", { eager: true });
const areaHub = import.meta.glob<Fm>("./areas.astro", { eager: true });
const areas = import.meta.glob<Fm>("./areas/*.md", { eager: true });
const allergyHub = import.meta.glob<Fm>("./allergy-season.astro", { eager: true });
const allergy = import.meta.glob<Fm>("./allergy-season/*.md", { eager: true });
const hostHub = import.meta.glob<Fm>("./airbnb-hosts.astro", { eager: true });
const hosts = import.meta.glob<Fm>("./airbnb-hosts/*.md", { eager: true });

export const GET: APIRoute = () => {
  const entries = [...STATIC];
  if (Object.keys(hub).length) entries.push({ path: "/omaha-homes", lastmod: HUB_LASTMOD["/omaha-homes"] });
  for (const [file, mod] of Object.entries(guides)) {
    const fm = mod.frontmatter ?? {};
    if (fm.draft) continue;
    const slug = file.replace("./omaha-homes/", "").replace(/\.md$/, "");
    entries.push({ path: `/omaha-homes/${slug}`, lastmod: String(fm.updated ?? fm.published ?? "2026-10-03") });
  }
  if (Object.keys(areaHub).length) entries.push({ path: "/areas", lastmod: HUB_LASTMOD["/areas"] });
  for (const [file, mod] of Object.entries(areas)) {
    const fm = mod.frontmatter ?? {};
    if (fm.draft) continue;
    const slug = file.replace("./areas/", "").replace(/\.md$/, "");
    entries.push({ path: `/areas/${slug}`, lastmod: String(fm.updated ?? fm.published ?? "2026-10-03") });
  }
  if (Object.keys(allergyHub).length) entries.push({ path: "/allergy-season", lastmod: HUB_LASTMOD["/allergy-season"] });
  for (const [file, mod] of Object.entries(allergy)) {
    const fm = mod.frontmatter ?? {};
    if (fm.draft) continue;
    const slug = file.replace("./allergy-season/", "").replace(/\.md$/, "");
    entries.push({ path: `/allergy-season/${slug}`, lastmod: String(fm.updated ?? fm.published ?? "2026-10-03") });
  }
  if (Object.keys(hostHub).length) entries.push({ path: "/airbnb-hosts", lastmod: HUB_LASTMOD["/airbnb-hosts"] });
  for (const [file, mod] of Object.entries(hosts)) {
    const fm = mod.frontmatter ?? {};
    if (fm.draft) continue;
    const slug = file.replace("./airbnb-hosts/", "").replace(/\.md$/, "");
    entries.push({ path: `/airbnb-hosts/${slug}`, lastmod: String(fm.updated ?? fm.published ?? "2026-10-03") });
  }
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.map((e) => `  <url><loc>${SITE}${e.path === "/" ? "/" : e.path}</loc><lastmod>${e.lastmod}</lastmod></url>`).join("\n") +
    `\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
