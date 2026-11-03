/**
 * Page "last modified" dates for the sitemap and Article dateModified.
 *
 * A page's lastmod is the last git commit that touched its OWN source file
 * (src/lib/lastmod.json, written by scripts/lastmod.mjs before each build).
 * Template-wide edits (Base.astro, layouts, nav, footer) deliberately do not move it:
 * stamping every URL with the same date teaches Google to ignore lastmod.
 * Fallbacks when a file isn't in git yet: frontmatter `updated`/`published`, then PAGE_LASTMOD.
 * `npm run check:lastmod` (after a build) compares dist/sitemap.xml with git.
 */
import gitDates from "./lastmod.json";

const git = (file: string): string | undefined => (gitDates as Record<string, string>)[file];

/** Kept for layouts that import the type. */
export type Layout = "AreaPage" | "HostBrief" | "OmahaGuide" | "SeasonGuide" | "DevelopmentGuide" | "NeighborhoodGuide" | "CompareGuide" | "LifeEventGuide";

/** Fallback dates for .astro pages not yet in git. */
export const PAGE_LASTMOD: Record<string, string> = {
  "/": "2026-10-05",
  "/pricing": "2026-10-05",
  "/about": "2026-10-04",
  "/book": "2026-10-05",
  "/omaha-homes": "2026-10-22",
  "/areas": "2026-10-22",
  "/allergy-season": "2026-10-05",
  "/airbnb-hosts": "2026-10-05",
  "/developments": "2026-10-05",
  "/neighborhoods": "2026-10-22",
  "/knowledge-center": "2026-10-05",
  "/compare": "2026-10-05",
  "/life-events": "2026-10-22",
  "/care-providers": "2026-10-27",
};

const latest = (...dates: (string | undefined)[]) =>
  dates.filter((d): d is string => !!d).sort().at(-1)!;

const astroFile = (path: string) => (path === "/" ? "src/pages/index.astro" : `src/pages${path}.astro`);

/** lastmod for an .astro page: its own file's last commit. */
export const pageLastmod = (path: string) => git(astroFile(path)) ?? PAGE_LASTMOD[path];

/** lastmod for /knowledge-center: its own source plus every guide it lists. */
export const kcLastmod = (guides: { updated?: string; published?: string; file?: string }[]) =>
  latest(pageLastmod("/knowledge-center"), ...guides.map((g) => (g.file && git(g.file)) || g.updated || g.published));

/** lastmod for a markdown guide at /<section>/<slug>: its own file's last commit. */
export const guideLastmod = (fm: { updated?: string; published?: string }, _layout?: Layout, path?: string) =>
  (path && git(`src/pages${path}.md`)) || fm.updated || fm.published || PAGE_LASTMOD["/"];
