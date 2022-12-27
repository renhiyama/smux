self.addEventListener("install", (e) => {
  e.waitUntil(async () => {
    caches.open("pwa-assets")
      .then(cache => {
        //ace editor
        cache.add("https://cdn.jsdelivr.net/npm/ace-builds@1.14.0/src-min-noconflict/ace.js");
        //ace editor themes
        cache.addAll(['ambiance',
          'cobalt',
          'dawn',
          'dracula',
          'dreamweaver',
          'eclipse',
          'github',
          'gob',
          'monokai',
          'nord_dark',
          'one_dark',
          'tomorrow',
          'tomorrow_night',
          'tomorrow_night_blue',
          'tomorrow_night_bright',
          'tomorrow_night_eighties',
          'twilight',
          'vibrant_ink'].map(l => `https://cdn.jsdelivr.net/npm/ace-builds@1.14.0/src-min-noconflict/theme-${l}.min.js`))
        //our files
        cache.addAll([
          "/build.css",
          "/editor.js",
          "/manifest.json",
          "/helper.js"
        ])
        //our logos
        cache.addAll([
          "/logos/192x192.png",
          "/logos/512x512.png",
          "/logos/svg.svg",
          "/logos/transparent.svg"
        ])
        //fileicons
        cache.addAll([
          "js", "css"
        ].map(l => `/fileicons/file_type_${l}.svg`));
        cache.addAll(["default_file",
          "default_folder_opened",
          "default_folder",
          "default_root_folder_opened",
          "default_root_folder",
        ].map(l => `/fileicons/${l}.svg`));

      })
  });
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
    .then(cachedResponse => {
    // It can update the cache to serve updated content on the next request
        return cachedResponse || fetch(event.request);
    }
  )
 )
});