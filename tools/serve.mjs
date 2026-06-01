import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { createServer } from "node:http";

const root = resolve(".");
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".sol": "text/plain; charset=utf-8",
};

function safePath(url) {
  const clean = decodeURIComponent(url.split("?")[0]);
  const target = resolve(join(root, clean === "/" ? "index.html" : clean));
  return target.startsWith(root) ? target : null;
}

createServer((request, response) => {
  const target = safePath(request.url || "/");
  if (!target || !existsSync(target) || statSync(target).isDirectory()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": types[extname(target)] || "application/octet-stream",
  });
  createReadStream(target).pipe(response);
}).listen(port, () => {
  console.log(`Base AgentGuard running at http://localhost:${port}`);
});
