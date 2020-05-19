const cacheName = 'v1';

self.addEventListener('install', (e) => {
  console.log('Service worker was successfully installed...');
});

self.addEventListener('activate', (e) => {
  console.log('Service worker was successfully activated...');
  e.waitUntil (
    caches
      .keys()
      .then (cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if(cache !== cacheName) {
              console.log('Service worker is clearing old cached files...');
              return caches.delete(cache);
            }
          })
        )
      })
  )
})

self.addEventListener('fetch', (e) => {
  console.log('Service worker is successfully fetching files...');
  e.respondWith (
    fetch(e.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(cacheName)
          .then(cache => {
            cache.put(e.request, resClone);
          })
        return res;
      })
      .catch (error => caches.match(e.request)
        .then(cachedResponse => {
          return cachedResponse || fetch('https://dinakajoy.github.io/news-app/js/fallback.json')
        })
      )
  )
})