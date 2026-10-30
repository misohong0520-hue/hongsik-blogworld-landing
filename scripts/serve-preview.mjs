import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Serve the production export on this computer only. No hosting/deploy calls.
const directory = fileURLToPath(new URL("../out/", import.meta.url));
if (!fs.existsSync(path.join(directory, "index.html"))) throw new Error("Run npm run build before npm run preview.");
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".png": "image/png", ".ico": "image/x-icon", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml" };
const server = http.createServer((request, response) => {
  if (!["GET", "HEAD"].includes(request.method)) { response.writeHead(405, { Allow: "GET, HEAD" }).end(); return; }
  let filename;
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    filename = path.resolve(directory, `.${pathname}`);
    const relative = path.relative(directory, filename);
    if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) { response.writeHead(403).end(); return; }
    if (fs.existsSync(filename) && fs.statSync(filename).isDirectory()) filename = path.join(filename, "index.html");
  } catch { response.writeHead(400).end(); return; }
  if (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) { response.writeHead(404).end("Not found"); return; }
  response.writeHead(200, { "Content-Type": types[path.extname(filename)] || "application/octet-stream", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
  if (request.method === "HEAD") response.end();
  else fs.createReadStream(filename).pipe(response);
});
server.on("error", (error) => { console.error(error.message); process.exitCode = 1; });
server.listen(3130, "127.0.0.1", () => console.log("Local preview: http://127.0.0.1:3130/?review=feature-journey\nProduction export only. Public site unchanged.\nCtrl+C to stop."));
