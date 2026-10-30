import assert from "node:assert/strict";
import fs from "node:fs";

// Source palette checks; this does not measure composited browser pixels.
const css = fs.readFileSync("src/app/globals.css", "utf8");
const token = (name) => {
  const value = css.match(new RegExp(`--landing-${name}:\\s*(#[a-f0-9]{6})`, "i"))?.[1];
  assert(value, `Missing color token: ${name}`);
  return value;
};
const luminance = (hex) => hex.slice(1).match(/../g)
  .map((channel) => parseInt(channel, 16) / 255)
  .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);

const pairs = [
  ["body on white", token("muted"), "#ffffff"],
  ["body on lavender", token("muted"), "#f9f8fe"],
  ["body on pale mint sample", token("muted"), "#e4f3ed"],
  ["action on mint", token("ink"), token("mint")],
  ["action on hover mint", token("ink"), "#43aa83"],
  ["status on light mint", token("ink"), "#85dab9"],
  ["green action on white", token("link"), "#ffffff"],
  ["footer muted on dark", "#a6a6a6", "#161c28"],
  ["contact muted on card", "#a6a6a6", "#222938"],
  ["focus outline on white", "#16845c", "#ffffff"],
].map(([label, foreground, background]) => {
  const a = luminance(foreground), b = luminance(background);
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  assert(ratio >= 4.5, `${label} has insufficient palette contrast: ${ratio}`);
  return { label, foreground, background, ratio: Number(ratio.toFixed(2)) };
});
console.log(JSON.stringify({ pass: true, scope: "source palette only; browser compositing unverified", pairs }, null, 2));
