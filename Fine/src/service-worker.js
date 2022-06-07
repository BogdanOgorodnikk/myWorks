import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { skipWaiting } from "workbox-core";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { StaleWhileRevalidate, NetworkFirst } from "workbox-strategies";

precacheAndRoute(self.__WB_MANIFEST);

// Return index.html for all navigation requests if is not Cypress
const handler = createHandlerBoundToURL("/index.html");
const navigationRoute = new NavigationRoute(handler);

registerRoute(navigationRoute);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new StaleWhileRevalidate({
    cacheName: "google-fonts",
  })
);

// Cache the api requests with a network first strategy.
registerRoute(
  ({ url }) => url.href.includes("/api/"),
  new NetworkFirst({
    cacheName: "api",
  })
);

// Install new service worker when ok, then reload page.
self.addEventListener("message", (msg) => {
  if (msg.data.action === "skipWaiting") {
    skipWaiting();
  }
});

// Web push notification #TODO: Uncomment this code when push notifications will be needed
// let click_open_url;
//
// self.addEventListener("push", (event) => {
//   click_open_url = "https://ru.vuejs.org";
//
//   const options = {
//     body: "Test",
//     icon: "/media/logos/logo-letter-dark.svg",
//     image: "/media/mail/key.png",
//     vibrate: [200, 100, 200, 100, 200, 100, 200],
//     tag: "vibration-sample",
//   };
//
//   event.waitUntil(self.registration.showNotification("my notify", options));
// });
//
// self.addEventListener("notificationclick", (event) => {
//   const clickedNotification = event.notification;
//
//   clickedNotification.close();
//
//   if (click_open_url) {
//     // eslint-disable-next-line no-undef
//     const promiseChain = clients.openWindow(click_open_url);
//
//     event.waitUntil(promiseChain);
//   }
// });
