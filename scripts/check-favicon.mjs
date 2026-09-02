const urls = [
  "https://www.gudev.com.br/",
  "https://www.gudev.com.br/favicon.ico",
  "https://www.gudev.com.br/favicon-48.png",
  "https://www.gudev.com.br/icon-512.png",
  "https://www.gudev.com.br/icon.png",
  "https://www.gudev.com.br/apple-icon.png",
];

(async () => {
  for (const url of urls) {
    try {
      const r = await fetch(url, { redirect: "follow" });
      const ct = r.headers.get("content-type") || "";
      const len = r.headers.get("content-length") || "";
      console.log(r.status, String(len).padStart(8), ct.slice(0, 45), url);
      if (url.endsWith("/")) {
        const html = await r.text();
        const links = [...html.matchAll(/<link[^>]+>/gi)]
          .map((m) => m[0])
          .filter((x) => /icon|apple|manifest/i.test(x));
        console.log("ICON LINKS:");
        for (const l of links) console.log(" ", l);
        console.log("has wolf/manifest?", /GuDev|favicon-48|icon-512/i.test(html));
      }
    } catch (e) {
      console.log("ERR", url, e.message);
    }
  }
})();
