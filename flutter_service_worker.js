'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "15b1cc9afcd3a9b457e7c26fe4118361",
"LogoBrand.png": "56307b334ae37ac7ccc8379856bd7421",
"index.html": "11c5da2672d211fa7b55bfeadf26e727",
"/": "11c5da2672d211fa7b55bfeadf26e727",
"main.dart.js": "feeadae58cca60feed28936829c98f46",
"flutter.js": "8ae00b472ec3937a5bee52055d6bc8b4",
"favicon.png": "9b511db83376d4e83f846396fb528ece",
"icons/Icon-192.png": "655ab2f57bbabd7a6c3bb3564a326349",
"icons/Icon-maskable-192.png": "655ab2f57bbabd7a6c3bb3564a326349",
"icons/Icon-maskable-512.png": "2fbbdb91c49738700c63ac11aa1fd54a",
"icons/Icon-512.png": "2fbbdb91c49738700c63ac11aa1fd54a",
"manifest.json": "11aa7aa417d9d28f60ef330c2f3f10f7",
"Emm_Logo_noB.png": "91dd664f79ab63e363895d080ade10a0",
"assets/web/Emm_Logo_noB.png": "91dd664f79ab63e363895d080ade10a0",
"assets/AssetManifest.json": "4a8b08d1ead6ad8baeaa0378ad10e82f",
"assets/NOTICES": "f04ca0b69bf52ab120ba00340da25d87",
"assets/FontManifest.json": "6c0470a95a3f41d9ab54cc30bf0a24f4",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "2ad5fabd6a36a6deff087b8edfd0c1f8",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/images/EMM_Cubo.png": "fb1876a6d37426587c48800e48ba4ffd",
"assets/assets/images/socialmedia.png": "70a305cd8dc1c151d9e1733b0cfe46e2",
"assets/assets/images/LogoBrand.png": "56307b334ae37ac7ccc8379856bd7421",
"assets/assets/images/flutter.png": "496166b5b52e02865c338bb52558e54e",
"assets/assets/images/games.png": "5d97027c3e6e8f8de1f0cca01e1587d9",
"assets/assets/images/about_me.png": "2e0642ee8d61ce43f8557bcd3fbf90af",
"assets/assets/images/js.png": "0cded3a3276425911d55a2552bf361bf",
"assets/assets/images/Robot013.jpg": "eb1beab7b6ab1f1b588abc29c966ed5e",
"assets/assets/images/css3.png": "c9421be52fe48fdf04839b53f8e9f1d4",
"assets/assets/images/3d.png": "c3692866ae789c5647844423074eb837",
"assets/assets/images/Emm_Brand.png": "5691923824b19320fe5af9af6941ee0b",
"assets/assets/images/web.png": "73cd7e35330c19fb39d1d86a54dfd135",
"assets/assets/images/mobile.png": "52ea1369b58454a505a4e9e44da7ff18",
"assets/assets/images/blockchain.png": "d0e1408cd56348ea785185de2fc3a5f3",
"assets/assets/images/blender.png": "11f594b2575b8c53439f293258ee9f0a",
"assets/assets/images/Emm_Logo_noB.png": "91dd664f79ab63e363895d080ade10a0",
"assets/assets/images/dart.png": "01584466829a00df17f0900e1dd09ce3",
"assets/assets/images/html5.png": "dc5ac3996cdf010f80ff5744286cb577",
"assets/assets/fonts/Milker/Milker.otf": "7307888cd1a72c957e9914514f5557fb",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
