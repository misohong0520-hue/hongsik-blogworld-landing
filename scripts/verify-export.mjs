import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { Window } from "happy-dom";

const root = path.resolve("out");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const window = new Window({ settings: { disableJavaScriptEvaluation: true, disableJavaScriptFileLoading: true, disableCSSFileLoading: true, enableImageFileLoading: false } });
const document = new window.DOMParser().parseFromString(html, "text/html");
const elementsWithId = [...document.querySelectorAll("[id]")];
const ids = new Set(elementsWithId.map((element) => element.id));
assert.equal(ids.size, elementsWithId.length, "IDs must be unique");
const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
const missingAnchors = [...new Set(anchors.filter((id) => !ids.has(id)))];
assert.deepEqual(missingAnchors, [], "Every section link must have a target");
assert.equal((html.match(/<h1\b/g) || []).length, 1, "The page must have one main heading");
assert(!html.includes("상위 노출이나 수익을 보장하지 않습니다"), "Hidden notice must stay hidden");
assert(!html.includes("figma.com/api/mcp/asset"), "No temporary Figma runtime URLs");
assert(html.includes("mailto:support@hongsik.blog"), "The email action must exist");
assert.equal(document.documentElement.lang, "ko", "Document language must be Korean");
assert.equal(document.title, "HongSik BlogWorld");
const meta = (key) => document.querySelector(`meta[name="${key}"], meta[property="${key}"]`)?.getAttribute("content");
assert(meta("description"), "A description is required");
assert(meta("viewport")?.includes("width=device-width"), "Responsive viewport metadata is required");
const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
assert.equal(canonical, "https://blogworld.hongsik.blog/");
assert.equal(new URL(meta("og:url")).href, canonical);
assert.equal(meta("og:title"), document.title);
assert.equal(meta("og:locale"), "ko_KR");
assert.equal(meta("og:type"), "website");
assert(meta("og:image:alt"), "Shared image alt text is required");
assert(meta("twitter:card"), "Twitter card metadata is required");

for (const image of document.querySelectorAll("img")) {
  assert(image.hasAttribute("alt"), "Every image needs an alt attribute");
  assert(Number(image.getAttribute("width")) > 0 && Number(image.getAttribute("height")) > 0, "Images need intrinsic dimensions");
}
for (const element of document.querySelectorAll("[aria-labelledby]")) {
  for (const id of element.getAttribute("aria-labelledby").split(/\s+/)) assert(ids.has(id), `Missing accessible label: ${id}`);
}
for (const link of document.querySelectorAll("a")) {
  assert(link.getAttribute("href") && link.getAttribute("href") !== "#", "No empty action links");
  assert(link.textContent.trim() || link.getAttribute("aria-label"), "Links must have an accessible name");
}
let previousHeading = 0;
for (const heading of document.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
  const level = Number(heading.tagName[1]);
  assert(level <= previousHeading + 1, "Heading levels must not skip down a level");
  previousHeading = level;
}

const urls = new Set();
const collectUrl = (value, base = canonical) => {
  if (!value || value.startsWith("data:") || value.startsWith("#")) return;
  const url = new URL(value, base);
  if (url.origin === new URL(canonical).origin) urls.add(url.pathname);
};
for (const element of document.querySelectorAll("img[src],script[src],link[href]")) {
  collectUrl(element.getAttribute("src") ?? element.getAttribute("href"));
}
collectUrl(meta("og:image"));
collectUrl(meta("twitter:image"));
urls.delete("/");
let builtStyles = "";
for (const url of urls) {
  const file = path.join(root, decodeURIComponent(url));
  assert(fs.existsSync(file) && fs.statSync(file).size > 0, `Missing or empty asset: ${url}`);
  if (url.endsWith(".css")) {
    const css = fs.readFileSync(file, "utf8");
    builtStyles += css;
    // Also resolve relative font URLs, not just root-relative image paths.
    for (const match of css.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) collectUrl(match[1], new URL(url, canonical));
  }
}

// Catch a successful build that has silently lost its CSS Module exports.
const undefinedClasses = [...document.querySelectorAll("[class]")].filter((element) => element.classList.contains("undefined"));
assert.equal(undefinedClasses.length, 0, "CSS Module imports must not produce undefined classes");
const styledSections = [...document.querySelectorAll("header, section, footer")];
for (const element of styledSections) {
  assert(element.classList.length, `${element.tagName} is missing its section style`);
  for (const className of element.classList) assert(builtStyles.includes(`.${className}`), `Section class has no stylesheet: ${className}`);
}
const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
assert(robots.includes(`Sitemap: ${new URL("sitemap.xml", canonical)}`));
assert(sitemap.includes(`<loc>${canonical}</loc>`));
const sharedImage = fs.readFileSync(path.join(root, new URL(meta("og:image")).pathname));
assert.equal(sharedImage.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "Shared image must be a PNG");
assert.equal(sharedImage.readUInt32BE(16), Number(meta("og:image:width")));
assert.equal(sharedImage.readUInt32BE(20), Number(meta("og:image:height")));
const report = { pass: true, headings: 1, sectionTargets: ids.size, anchorLinks: anchors.length, localAssets: urls.size, imageElements: document.querySelectorAll("img").length, styledSections: styledSections.length, undefinedClassTokens: 0, metadata: "canonical, OG, Twitter, robots, sitemap verified" };
await window.happyDOM.close();
console.log(JSON.stringify(report, null, 2));
