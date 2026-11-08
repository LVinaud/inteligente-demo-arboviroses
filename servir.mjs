// Servidor local que imita o GitHub Pages para testar a versão estática: serve a pasta
// sob o prefixo do repositório e responde 404.html (com status 404) ao que não existir,
// como o Pages faz. Só usa o Node, sem dependências.
//
// Uso: node servir.mjs [pasta, padrão docs] [porta, padrão 4000] [prefixo, padrão /inteligente-demo-arboviroses/]
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

const PASTA = path.resolve(process.argv[2] || "docs");
const PORTA = Number(process.argv[3] || 4000);
const PREFIXO = process.argv[4] || "/inteligente-demo-arboviroses/";
const TIPOS = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".geojson": "application/geo+json", ".png": "image/png",
  ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8",
};

const arquivo = (relativo) => {
  const alvo = path.join(PASTA, relativo);
  if (!alvo.startsWith(PASTA)) return null;
  try {
    const info = statSync(alvo);
    if (info.isFile()) return alvo;
    if (info.isDirectory()) return arquivo(path.join(relativo, "index.html"));
  } catch {}
  return null;
};

createServer((req, res) => {
  const caminho = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (caminho === PREFIXO.replace(/\/$/, "")) {
    res.writeHead(301, { Location: PREFIXO }).end();
    return;
  }
  const encontrado = caminho.startsWith(PREFIXO) ? arquivo(caminho.slice(PREFIXO.length)) : null;
  const servido = encontrado || path.join(PASTA, "404.html");
  // O GitHub Pages manda cache de 10 minutos; aqui também, para o teste medir algo parecido.
  res.writeHead(encontrado ? 200 : 404, {
    "Content-Type": TIPOS[path.extname(servido)] || "application/octet-stream",
    "Cache-Control": "max-age=600",
  });
  createReadStream(servido).pipe(res);
}).listen(PORTA, () => console.log(`Versão estática em http://localhost:${PORTA}${PREFIXO} (pasta ${PASTA})`));
