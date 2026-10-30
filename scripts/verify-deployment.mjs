import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";

const base = "https://blogworld.hongsik.blog/";
const expected = JSON.parse(fs.readFileSync("out/deployment.json", "utf8")).sourceCommit;
const get = (url, options = {}) => fetch(url, { signal: AbortSignal.timeout(15000), ...options });
const redirect = await get(base.replace("https:", "http:"), { redirect: "manual" });
assert.equal(redirect.status, 301, "HTTP must redirect to HTTPS");
assert.equal(redirect.headers.get("location"), base);
await redirect.body?.cancel();

const response = await get(base, { headers: { "accept-encoding": "gzip" } });
assert.equal(response.status, 200);
assert.equal(response.url, base);
assert(response.headers.get("content-type")?.startsWith("text/html"));
assert.equal(response.headers.get("cache-control"), "no-cache");
assert.equal(response.headers.get("content-encoding"), "gzip");
const served = Buffer.from(await response.arrayBuffer());
const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
assert.equal(hash(served), hash(fs.readFileSync("out/index.html")), "Served HTML must match the verified build");
const release = await get(new URL("deployment.json", base));
assert.equal(release.status, 200);
assert.equal((await release.json()).sourceCommit, expected);

const files = fs.readFileSync("out/release-manifest.sha256", "utf8").trim().split("\n").map((line) => line.slice(66));
let next = 0;
let checked = 0;
const types = { ".css": "text/css", ".js": "application/javascript", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".html": "text/html" };
await Promise.all(Array.from({ length: 4 }, async () => {
  while (next < files.length) {
    const file = files[next++];
    const result = await get(new URL(file, base), { method: "HEAD" });
    assert.equal(result.status, 200, `Missing deployed file: ${file}`);
    const suffix = file.slice(file.lastIndexOf("."));
    if (types[suffix]) assert(result.headers.get("content-type")?.startsWith(types[suffix]), `Wrong MIME: ${file}`);
    if (file.startsWith("_next/static/")) assert(result.headers.get("cache-control")?.includes("immutable"), `Missing static cache: ${file}`);
    checked++;
  }
}));

const missing = await get(new URL(`__missing_${expected.slice(0, 12)}`, base));
assert.equal(missing.status, 404, "Unknown paths must return 404");
await missing.body?.cancel();

const wordpress = [];
const baselinePath = ".preview/stage6-wordpress-baseline.json";
if (fs.existsSync(baselinePath)) {
  for (const baseline of JSON.parse(fs.readFileSync(baselinePath, "utf8"))) {
    const result = await get(baseline.url);
    const html = await result.text();
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? null;
    assert.equal(result.status, baseline.status, "WordPress status changed");
    assert.equal(result.url, baseline.finalUrl, "WordPress redirect changed");
    assert.equal(title, baseline.title, "WordPress title changed");
    wordpress.push({ url: baseline.url, status: result.status, titleUnchanged: true });
  }
}
console.log(JSON.stringify({ pass: true, url: base, revision: expected, deployedFiles: checked, https: "verified by TLS-enabled fetch", gzip: true, htmlMatchesBuild: true, unknownPathStatus: 404, wordpress, browserVisualQA: "not covered" }, null, 2));
