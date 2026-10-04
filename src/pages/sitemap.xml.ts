import type { APIRoute } from "astro";

const SITE = "https://omahamattresscleaning.com";
/** Last substantive edit of each fixed page. Bump a date only when that page's content really changes. */
const STATIC: { path: string; lastmod: string }[] = [
  { path: "/", lastmod: "2026-10-03" },
  { path: "/about", lastmod: "2026-10-03" },
  { path: "/book", lastmod: "2026-10-03" },
];

type Fm = { frontmatter?: { updated?: string; published?: string; draft?: boolean } };
const hub = import.meta.glob<Fm>("./omaha-homes.astro", { eager: true });
const guides = import.meta.glob<Fm>("./omaha-homes/*.md", { eager: true });
const areaHub = import.meta.glob<Fm>("./areas.astro", { eager: true });
const areas = import.meta.glob<Fm>("./areas/*.md", { eager: true });

export const GET: APIRoute = () => {
  const entries = [...STATIC];
  if (Object.keys(hub).length) entries.push({ path: "/omaha-homes", lastmod: "2026-10-03" });
  for (const [file, mod] of Object.entries(guides)) {
    const fm = mod.frontmatter ?? {};
    if (fm.draft) continue;
    const slug = file.replace("./omaha-homes/", "").replace(/\.md$/, "");
    entries.push({ path: `/omaha-homes/${slug}`, lastmod: String(fm.updated ?? fm.published ?? "2026-10-03") });
  }
  if (Object.keys(areaHub).length) entries.push({ path: "/areas", lastmod: "2026-10-03" });
  for (const [file, mod] of Object.entries(areas)) {
    const fm = mod.frontmatter ?? {};
    if (fm.draft) continue;
    const slug = file.replace("./areas/", "").replace(/\.md$/, "");
    entries.push({ path: `/areas/${slug}`, lastmod: String(fm.updated ?? fm.published ?? "2026-10-03") });
  }
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.map((e) => `  <url><loc>${SITE}${e.path === "/" ? "/" : e.path}</loc><lastmod>${e.lastmod}</lastmod></url>`).join("\n") +
    `\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
