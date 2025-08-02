// Service Worker for Islamic Prayer App
const CACHE_NAME = 'islamic-prayer-app-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/favicon.ico'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200, 100, 200],
      data: data,
      actions: [
        {
          action: 'mark-prayed',
          title: '✅ Mark as Prayed',
          icon: '/favicon.ico'
        },
        {
          action: 'remind-later',
          title: '⏰ Remind in 5 min',
          icon: '/favicon.ico'
        },
        {
          action: 'dismiss',
          title: '❌ Dismiss'
        }
      ],
      requireInteraction: true,
      persistent: true
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'mark-prayed') {
    // Handle mark as prayed action
    console.log('Prayer marked as completed');
  } else if (event.action === 'remind-later') {
    // Set a reminder for 5 minutes later
    setTimeout(() => {
      self.registration.showNotification('🕌 Prayer Reminder', {
        body: 'Don\'t forget to pray! Allah is waiting for your worship.',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200],
        requireInteraction: true
      });
    }, 5 * 60 * 1000); // 5 minutes
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll().then((clients) => {
        if (clients.length > 0) {
          // Focus existing window
          return clients[0].focus();
        } else {
          // Open new window
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Background sync for prayer times
self.addEventListener('sync', (event) => {
  if (event.tag === 'update-prayer-times') {
    event.waitUntil(updatePrayerTimes());
  }
});

async function updatePrayerTimes() {
  try {
    // Fetch updated prayer times
    const response = await fetch('/api/prayer-times');
    const prayerTimes = await response.json();
    
    // Store in IndexedDB or send to clients
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'PRAYER_TIMES_UPDATED',
        data: prayerTimes
      });
    });
  } catch (error) {
    console.error('Failed to update prayer times:', error);
  }
}

// Message event - handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_PRAYER_NOTIFICATION') {
    const { prayerName, prayerTime, delay } = event.data;
    
    // Schedule notification
    setTimeout(() => {
      self.registration.showNotification(`🕌 Prayer Time: ${prayerName}`, {
        body: `It's time for ${prayerName} prayer. May Allah accept your prayers.`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [200, 100, 200, 100, 200],
        data: { prayerName, prayerTime },
        actions: [
          { action: 'mark-prayed', title: '✅ Mark as Prayed' },
          { action: 'remind-later', title: '⏰ Remind in 5 min' },
          { action: 'dismiss', title: '❌ Dismiss' }
        ],
        requireInteraction: true,
        persistent: true
      });
    }, delay);
  }
});

// Handle periodic background sync for prayer time updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'prayer-times-sync') {
    event.waitUntil(updatePrayerTimes());
  }
});