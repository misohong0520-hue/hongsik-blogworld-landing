import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const run = (command, args) => execFileSync(command, args, { encoding: "utf8" }).trim();
assert.equal(path.resolve(run("git", ["rev-parse", "--show-toplevel"])), process.cwd(), "Run from this repository root");
assert.equal(run("git", ["status", "--porcelain"]), "", "Commit source changes before packaging");
assert(process.env.npm_execpath, "Run with npm run package:release");
const revision = run("git", ["rev-parse", "HEAD"]);
assert(/^[a-f0-9]{40}$/.test(revision));
execFileSync(process.execPath, [process.env.npm_execpath, "run", "build"], { stdio: "inherit" });
execFileSync(process.execPath, ["scripts/verify-export.mjs"], { stdio: "inherit" });
execFileSync(process.execPath, ["scripts/check-contrast.mjs"], { stdio: "inherit" });

fs.writeFileSync("out/deployment.json", JSON.stringify({ sourceCommit: revision }, null, 2) + "\n");
const files = [];
const visit = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(file);
    else if (entry.isFile() && entry.name !== "release-manifest.sha256") files.push(file);
    else if (!entry.isFile()) throw new Error(`Unsupported build entry: ${file}`);
  }
};
visit("out");
const manifest = files.sort().map((file) => {
  const hash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  return `${hash}  ${path.relative("out", file).replaceAll("\\", "/")}`;
}).join("\n") + "\n";
fs.writeFileSync("out/release-manifest.sha256", manifest);
const directory = path.resolve(".preview/releases");
fs.mkdirSync(directory, { recursive: true });
const archive = path.join(directory, `${revision}.tar.gz`);
execFileSync("tar", ["-czf", archive, "-C", "out", "."], { stdio: "inherit" });
const sha256 = crypto.createHash("sha256").update(fs.readFileSync(archive)).digest("hex");
fs.writeFileSync(`${archive}.sha256`, `${sha256}  ${path.basename(archive)}\n`);
console.log(JSON.stringify({ revision, archive, sha256, files: files.length }, null, 2));
