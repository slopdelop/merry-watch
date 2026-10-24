const CACHE = 'merry-watch-v2-2';
const ROOT = new URL('./',self.location).href;
const SHELL = ['./','index.html','styles.css?v=2','core.js','app.js?v=2','catalogue.json?v=2','manifest.webmanifest','assets/village-v2.webp','assets/shops-watch-v2.webp','assets/shops-soon-v2.webp','assets/shops-watched-v2.webp','assets/icon-192.png','assets/icon-512.png','assets/apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('merry-watch-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||!event.request.url.startsWith(ROOT))return;
  const request=event.request;
  if(request.destination==='image'){
    event.respondWith(caches.open(CACHE).then(async cache=>{const found=await cache.match(request);if(found)return found;const response=await fetch(request);if(response.ok)await cache.put(request,response.clone());return response;}));return;
  }
  event.respondWith(fetch(request).then(async response=>{if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone());}return response;}).catch(async()=>await caches.match(request)||(request.mode==='navigate'?await caches.match(new URL('./index.html',ROOT).href):Response.error())));
});
