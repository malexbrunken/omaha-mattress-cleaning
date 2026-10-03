/**
 * IndexNow daily submitter for omahamattresscleaning.com (Vercel Cron, see vercel.json).
 * Reads the live sitemap.xml and submits URLs whose lastmod is within the last 48 hours.
 * ?all=1 submits everything. Until SUBMIT_ALL_BEFORE, every run submits everything (first-run bootstrap).
 * Auth: Authorization: Bearer $CRON_SECRET if CRON_SECRET is set; otherwise only Vercel Cron requests
 * (x-vercel-cron header or vercel-cron/1.0 user agent). Never returns 500.
 */
const KEY = process.env.INDEXNOW_KEY || "1aab1107614309586245374bdda4518a";
const HOST = "omahamattresscleaning.com";
const SITE = "https://" + HOST;
const WINDOW_MS = 48 * 60 * 60 * 1000;
const SUBMIT_ALL_BEFORE = Date.parse("2026-10-17T00:00:00Z");

function authorized(req) {
  const secret = process.env.CRON_SECRET;
  if (secret) return req.headers.get("authorization") === "Bearer " + secret;
  const ua = req.headers.get("user-agent") || "";
  return req.headers.has("x-vercel-cron") || ua.startsWith("vercel-cron/");
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

export async function GET(req) {
  if (!authorized(req)) return json({ ok: false, error: "unauthorized" }, 401);
  const now = Date.now();
  const all = new URL(req.url).searchParams.get("all") === "1" || now < SUBMIT_ALL_BEFORE;
  try {
    const res = await fetch(SITE + "/sitemap.xml", { cache: "no-store" });
    if (!res.ok) throw new Error("sitemap.xml -> " + res.status);
    const xml = await res.text();
    const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
      loc: (m[1].match(/<loc>([\s\S]*?)<\/loc>/) || [])[1]?.trim(),
      lastmod: (m[1].match(/<lastmod>([\s\S]*?)<\/lastmod>/) || [])[1]?.trim(),
    })).filter((e) => e.loc && new URL(e.loc).host === HOST);
    const urls = [...new Set(entries.filter((e) => {
      if (all) return true;
      const t = Date.parse(e.lastmod || "");
      return !Number.isNaN(t) && now - t <= WINDOW_MS;
    }).map((e) => e.loc))];
    if (!urls.length) return json({ ok: true, mode: "recent", total: entries.length, submitted: 0 });
    const r = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: SITE + "/" + KEY + ".txt", urlList: urls }),
    });
    const ok = r.status === 200 || r.status === 202;
    const body = ok ? undefined : (await r.text().catch(() => "")).slice(0, 300);
    if (!ok) console.error("IndexNow ->", r.status, body);
    console.log("IndexNow:", all ? "all" : "recent", urls.length, "of", entries.length, "->", r.status);
    return json({ ok, mode: all ? "all" : "recent", total: entries.length, submitted: urls.length, status: r.status, body });
  } catch (e) {
    console.error("IndexNow run failed", e);
    return json({ ok: false, error: String(e) });
  }
}
