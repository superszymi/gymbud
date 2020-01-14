
if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute([
    '/index.html',
    '/dashboard',
    '/start-workout',
    '/atlas',
    '/atlas/review-template',
    '/workouts',
    '/templates',
  ])
  
  workbox.routing.registerRoute(
    /\.(?:js|json)$/,
    new workbox.strategies.NetworkFirst({
      cacheName: 'js-cache'
    })
  );

  workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'fonts-cache'
    })
  );
  
  workbox.routing.registerRoute(
    /\.css$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'css-cache'
    })
  );
  
  workbox.routing.registerRoute(
    /\.(?:svg|png|ico)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
       plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60
        })
      ]
    })
  )
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      }),
    );
  }
});

