// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Production origin used for canonical URLs, sitemap, and Open Graph tags.
export default defineConfig({
  site: "https://functionary.app",
  integrations: [sitemap()],
  // Static output (the default) — `astro build` emits plain HTML/CSS/JS
  // into `dist/`, which rsyncs straight into the nginx root. No SSR runtime.
});
