// Writes src/lib/lastmod.json: the date (America/Chicago) each page source file last
// changed in git. The sitemap uses it so <lastmod> moves only when a page's own content
// changes, never for template-wide or build-time edits.
// Runs before each build when full git history is available; otherwise the committed file is used.
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const sh = (c) => execSync(c, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, env: { ...process.env, TZ: "America/Chicago" } }).trim();
try {
  if (sh("git rev-parse --is-shallow-repository") === "true") {
    console.log("lastmod: shallow clone, keeping committed src/lib/lastmod.json");
    process.exit(0);
  }
} catch {
  console.log("lastmod: no git, keeping committed src/lib/lastmod.json");
  process.exit(0);
}
const out = {};
let date = "";
for (const line of sh('git log --format="@%cd" --date=format-local:%Y-%m-%d --name-only -- src/pages').split("\n")) {
  if (line.startsWith("@")) date = line.slice(1);
  else if (line && !(line in out)) out[line] = date;
}
const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync("src/lib/lastmod.json", JSON.stringify(sorted, null, 1) + "\n");
console.log(`lastmod: ${Object.keys(sorted).length} files`);
