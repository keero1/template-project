/// <reference lib="webworker" />
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute
} from 'workbox-precaching';
import {
  NavigationRoute,
  registerRoute
} from 'workbox-routing';

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting();
});

// self.__WB_MANIFEST is the default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

/** @type {RegExp[] | undefined} */
let allowlist;
// in dev mode, we disable precaching to avoid caching issues
if (import.meta.env.DEV)
  allowlist = [/^\/$/];

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
  { allowlist },
));

// Listen for push events
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');

  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error('Push data was not JSON:', e);
    }
  }

  const title = data.title || 'StudioBase Notification';
  const options = {
    body: data.body || 'You have a new message!',
    icon: 'icon.png',
    badge: 'badge.png', 
    data: {
      url: data.url || '/' 
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client && client.url === event.notification.data.url) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
