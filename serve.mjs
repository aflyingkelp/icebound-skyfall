import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const allowed=new Set(['index.html','game.js','multiplayer.js','style.css','three.module.js']);
http.createServer((request,response)=>{
  const name=new URL(request.url,'http://127.0.0.1').pathname.slice(1)||'index.html';
  if(!allowed.has(name)){response.writeHead(404);response.end('Not found');return;}
  const file=path.join(root,name);
  response.setHeader('Content-Type',name.endsWith('.js')?'text/javascript; charset=utf-8':name.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8');
  fs.createReadStream(file).on('error',()=>{response.statusCode=500;response.end('Unable to read file');}).pipe(response);
}).listen(4174,'127.0.0.1',()=>console.log('ICEBOUND: http://127.0.0.1:4174'));
