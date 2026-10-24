import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png'};
const port=Number(process.env.PORT??4173);
http.createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const p=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!p.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}const b=await fs.readFile(p);res.writeHead(200,{'Content-Type':types[path.extname(p)]??'application/octet-stream','Cache-Control':'no-cache'});res.end(b);}catch{res.writeHead(404);res.end('Not found');}}).listen(port,'0.0.0.0',()=>console.log(`Merry Watch preview: http://localhost:${port}`));
