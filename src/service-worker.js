import { build, files } from "$service-worker";
// Create a unique cache name for this deployment
const IMG_FOLDER = "https://www.orientsport.fr/oflash/img/";
const ICONS = [
  IMG_FOLDER + "Snow.png",
  IMG_FOLDER + "Rain.png",
  IMG_FOLDER + "Fog.png",
  IMG_FOLDER + "Wind.png",
  IMG_FOLDER + "Thunder.png",
  IMG_FOLDER + "Cloud.png",
  IMG_FOLDER + "SemiSun.png",
  IMG_FOLDER + "Sun.png",
  IMG_FOLDER + "Snow_in.png",
  IMG_FOLDER + "Rain_in.png",
  IMG_FOLDER + "Fog_in.png",
  IMG_FOLDER + "Wind_in.png",
  IMG_FOLDER + "Thunder_in.png",
  IMG_FOLDER + "Cloud_in.png",
  IMG_FOLDER + "SemiSun_in.png",
  IMG_FOLDER + "Sun_in.png",
  IMG_FOLDER + "Star.png",
  IMG_FOLDER + "Bivouac.png",
  IMG_FOLDER + "Camp.png",
  IMG_FOLDER + "Hotel.png",
  IMG_FOLDER + "Free.png",
  IMG_FOLDER + "Star_in.png",
  IMG_FOLDER + "Bivouac_in.png",
  IMG_FOLDER + "Camp_in.png",
  IMG_FOLDER + "Hotel_in.png",
  IMG_FOLDER + "Free_in.png",
  IMG_FOLDER + "ZeroDay.png",
  IMG_FOLDER + "ZeroDay_in.png",
  IMG_FOLDER + "Administratif.png",
  IMG_FOLDER + "Communication.png",
  IMG_FOLDER + "Equipement.png",
  IMG_FOLDER + "Hebergement.png",
  IMG_FOLDER + "Nourriture.png",
  IMG_FOLDER + "Sante.png",
  IMG_FOLDER + "Transport.png",
];

const CACHE = `cache-pct-v2`;
const ASSETS = [
  ...build, // the app itself
  ...files, // everything in `static`
  ...ICONS,
];
self.addEventListener("install", (event) => {
  // Create a new cache and add all files to it
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }
  event.waitUntil(addFilesToCache());
});
self.addEventListener("activate", (event) => {
  // Remove previous cached data from disk
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }
  event.waitUntil(deleteOldCaches());
});
self.addEventListener("fetch", (event) => {
  // ignore POST requests etc
  // if (event.request.method !== "GET") return;
  async function respond() {
    const url = new URL(event.request.url);
    console.info("url:", url.pathname);
    const cache = await caches.open(CACHE);
    // `build`/`files` can always be served from the cache
    if (ASSETS.includes(url.pathname)) {
      console.info("Cache:", url.pathname);
      return cache.match(event.request);
    }
    // for everything else, try the network first, but
    // fall back to the cache if we're offline
    try {
      const response = await fetch(event.request);
      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }
      return response;
    } catch {
      return cache.match(event.request);
    }
  }
  event.respondWith(respond());
});
