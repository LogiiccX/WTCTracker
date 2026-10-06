/* Work to Complete — lets the app open with no signal.
   Bump VERSION when you upload a new index.html so phones pick it up. */
const VERSION="wtc-template-v4";
const CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin===location.origin){            // app files: fresh copy when online, saved copy when not
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));return res})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match("./index.html"))));
    return;
  }
  if(/fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(u.host)){   // fonts + helper libraries: saved copy first
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp));return res})));
  }
});
