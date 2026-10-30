import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("out");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
const missingAnchors = [...new Set(anchors.filter((id) => !ids.has(id)))];
assert.deepEqual(missingAnchors, [], "Every section link must have a target");
assert.equal((html.match(/<h1\b/g) || []).length, 1, "The page must have one main heading");
assert(!html.includes("상위 노출이나 수익을 보장하지 않습니다"), "Hidden notice must stay hidden");
assert(!html.includes("figma.com/api/mcp/asset"), "No temporary Figma runtime URLs");
assert(html.includes("mailto:support@hongsik.blog"), "The email action must exist");
const urls = new Set([...html.matchAll(/(?:src|href)="(\/[^"?#]+)(?:[?#][^"]*)?"/g)].map((m) => m[1]));
for (const url of [...urls]) {
  const file = path.join(root, url);
  assert(fs.existsSync(file) && fs.statSync(file).size > 0, `Missing or empty asset: ${url}`);
  if (url.endsWith(".css")) {
    const css = fs.readFileSync(file, "utf8");
    for (const match of css.matchAll(/url\(["']?(\/[^)'"?#]+)["']?\)/g)) urls.add(match[1]);
  }
}
for (const url of urls) assert(fs.existsSync(path.join(root, url)), `Missing CSS asset: ${url}`);
const report = { pass: true, headings: 1, sectionTargets: ids.size, anchorLinks: anchors.length, localAssets: urls.size, imageElements: (html.match(/<img\b/g) || []).length };
console.log(JSON.stringify(report, null, 2));
