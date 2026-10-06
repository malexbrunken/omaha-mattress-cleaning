// Compare dist/sitemap.xml lastmod with git: each page's date should equal the latest
// commit date of its source file, src/layouts/Base.astro and (for markdown) its layout.
// Run after `npm run build`, in a full (non-shallow) clone.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

// Dates are read in America/Chicago, the business's time zone, so a commit or merge made
// after 7pm Central (already the next day in UTC) still counts as that Central day.
const gitDate = (...files) =>
  execFileSync("git", ["log", "-1", "--format=%cd", "--date=format-local:%Y-%m-%d", "--", ...files], {
    encoding: "utf8",
    env: { ...process.env, TZ: "America/Chicago" },
  }).trim();
const sitemap = readFileSync("dist/sitemap.xml", "utf8");
const rows = [...sitemap.matchAll(/<loc>https:\/\/omahamattresscleaning\.com([^<]*)<\/loc><lastmod>([^<]+)<\/lastmod>/g)];
let bad = 0;
for (const [, path, lastmod] of rows) {
  const base = path === "/" ? "src/pages/index" : `src/pages${path}`;
  const src = [`${base}.astro`, `${base}.md`].find(existsSync);
  const deps = [src, "src/layouts/Base.astro"];
  if (src.endsWith(".md")) {
    const m = readFileSync(src, "utf8").match(/^layout:\s*(\S+)/m);
    if (m) deps.push(m[1].replace(/^(\.\.\/)+/, "src/"));
  }
  // The KC index lists every guide, so any guide edit changes it.
  if (path === "/knowledge-center") deps.push("src/pages/omaha-homes", "src/pages/areas", "src/pages/allergy-season", "src/pages/airbnb-hosts", "src/pages/developments", "src/pages/compare", "src/pages/life-events");
  const expected = deps.map((d) => gitDate(d)).sort().at(-1);
  const ok = expected === lastmod;
  if (!ok) bad++;
  console.log(`${ok ? "ok  " : "FAIL"} ${lastmod} (git ${expected}) ${path}`);
}
console.log(`${rows.length} URLs, ${bad} mismatched`);
process.exit(bad ? 1 : 0);
