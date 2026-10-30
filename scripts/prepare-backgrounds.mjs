import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import sharp from "sharp";

// Pre-render the existing SVG filters once. No browser or live-page profiling.
const names = ["205f7", "c5a56", "c683b", "08cdd", "6190a", "50ba5"];
const outputSize = 512;
const hash = (data) => crypto.createHash("sha256").update(data).digest("hex");
fs.mkdirSync("public/images/glows", { recursive: true });
const assets = [];

for (const name of names) {
  const source = `public/figma/${name}.svg`;
  const output = `public/images/glows/${name}.webp`;
  const original = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const encoded = await sharp(original.data, { raw: original.info })
    .resize(outputSize, outputSize).webp({ lossless: true, effort: 6 }).toBuffer();
  const comparisons = [];
  for (const background of ["#ffffff", "#54bd95"]) {
    const reference = await sharp(original.data, { raw: original.info })
      .flatten({ background }).raw().toBuffer();
    const restored = await sharp(encoded).resize(original.info.width, original.info.height)
      .flatten({ background }).raw().toBuffer();
    assert.equal(reference.length, restored.length);
    let maximum = 0, total = 0;
    for (let i = 0; i < reference.length; i++) {
      const difference = Math.abs(reference[i] - restored[i]);
      maximum = Math.max(maximum, difference);
      total += difference;
    }
    const mean = total / reference.length;
    assert(maximum <= 6 && mean < 0.5, `Excessive pixel difference: ${name} on ${background}`);
    comparisons.push({ background, maxChannelDifference: maximum, meanChannelDifference: Number(mean.toFixed(4)) });
  }
  fs.writeFileSync(output, encoded);
  assets.push({ source, output, sourceSha256: hash(fs.readFileSync(source)), outputSha256: hash(encoded),
    sourceWidth: original.info.width, sourceHeight: original.info.height,
    width: outputSize, height: outputSize, bytes: encoded.length,
    decodedPixelReductionPercent: Number((100 * (1 - outputSize ** 2 / (original.info.width * original.info.height))).toFixed(2)),
    comparisons });
}

const report = { scope: "Offline asset comparison with Sharp, not browser pixels or scroll FPS", format: "Lossless WebP at reduced resolution; CSS display sizes and positions unchanged", assets };
fs.writeFileSync("design/background-optimization.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
