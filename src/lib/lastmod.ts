/**
 * Page "last modified" dates for the sitemap and Article dateModified.
 *
 * A page changes when its own source changes OR when a template it renders through
 * changes (e.g. #11 added the phone line to every layout). So a page's lastmod is the
 * latest of: its own date (frontmatter `updated`, or the date below for .astro pages),
 * Base.astro's date and its layout's date.
 *
 * Keep these equal to the last commit that touched each file:
 *   git log -1 --format=%cd --date=format:%Y-%m-%d -- src/layouts/<File>.astro
 * `npm run check:lastmod` (after a build) compares dist/sitemap.xml with git.
 */
export const TEMPLATE_LASTMOD = {
  Base: "2026-10-05",
  AreaPage: "2026-10-04",
  HostBrief: "2026-10-04",
  OmahaGuide: "2026-10-04",
  SeasonGuide: "2026-10-04",
  DevelopmentGuide: "2026-10-05",
  CompareGuide: "2026-10-05",
  LifeEventGuide: "2026-10-05",
} as const;
export type Layout = keyof typeof TEMPLATE_LASTMOD;

/** Last edit of each .astro page's own source file. */
export const PAGE_LASTMOD: Record<string, string> = {
  "/": "2026-10-05",
  "/pricing": "2026-10-05",
  "/about": "2026-10-04",
  "/book": "2026-10-04",
  "/omaha-homes": "2026-10-05",
  "/areas": "2026-10-05",
  "/allergy-season": "2026-10-05",
  "/airbnb-hosts": "2026-10-05",
  "/developments": "2026-10-05",
  "/knowledge-center": "2026-10-05",
  "/compare": "2026-10-05",
  "/life-events": "2026-10-05",
};

const latest = (...dates: (string | undefined)[]) =>
  dates.filter((d): d is string => !!d).sort().at(-1)!;

/** lastmod for an .astro page that renders through Base only. */
export const pageLastmod = (path: string) => latest(PAGE_LASTMOD[path], TEMPLATE_LASTMOD.Base);

/**
 * lastmod for /knowledge-center: its own source and Base, plus every guide it lists
 * (a new or updated guide changes the index).
 */
export const kcLastmod = (guides: { updated?: string; published?: string }[]) =>
  latest(pageLastmod("/knowledge-center"), ...guides.map((g) => g.updated ?? g.published));

/** lastmod for a markdown guide: its frontmatter date, Base and its layout. */
export const guideLastmod = (fm: { updated?: string; published?: string }, layout: Layout) =>
  latest(fm.updated ?? fm.published, TEMPLATE_LASTMOD.Base, TEMPLATE_LASTMOD[layout]);
