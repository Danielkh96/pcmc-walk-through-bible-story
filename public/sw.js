const CACHE_NAME = "pcmc-bible-story-v12-episode-04";
const APP_SHELL = [
  "/",
  "/comic",
  "/comic/contents",
  "/manifest.webmanifest",
  "/pcmc-logo.png",
  "/pwa-icon-192.png",
  "/pwa-icon-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("pcmc-bible-story-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    new URL(event.request.url).origin !== self.location.origin
  )
    return;
  if (event.request.mode === "navigate") {
    // Chapter is server-rendered: never reuse chapter one's shell for chapter two.
    // Page-number queries still hydrate on the client within the same chapter.
    const url = new URL(event.request.url);
    const chapter = url.searchParams.get("chapter") || "episode-01";
    const pageKey = url.pathname === "/comic/read"
      ? url.pathname + "?chapter=" + encodeURIComponent(chapter)
      : url.pathname;
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            event.waitUntil(
              caches.open(CACHE_NAME).then((cache) => cache.put(pageKey, copy)),
            );
          }
          return response;
        })
        .catch(async () => (await caches.match(pageKey)) || new Response(
          "此页面尚未离线保存，请连接网络后再打开。 This page is not available offline yet.",
          { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } },
        )),
    );
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok)
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, response.clone()));
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});
