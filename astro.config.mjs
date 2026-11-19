// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

/**
 * Pages for working on the figures (src/dev-pages/). The dev server routes
 * them; a build never does, so they cannot reach the published site.
 * deploy/deploy.sh also refuses a build that contains them.
 * @returns {import("astro").AstroIntegration}
 */
const devPages = () => ({
  name: "dev-pages",
  hooks: {
    "astro:config:setup": ({ command, injectRoute }) => {
      if (command !== "dev") return;
      injectRoute({ pattern: "/hero-frame", entrypoint: "./src/dev-pages/hero-frame.astro" });
      injectRoute({ pattern: "/heroes", entrypoint: "./src/dev-pages/heroes.astro" });
    },
  },
});

// Production origin used for canonical URLs, sitemap, and Open Graph tags.
export default defineConfig({
  site: "https://functionary.app",
  integrations: [sitemap(), devPages()],
  // Static output (the default): `astro build` emits plain HTML/CSS/JS into
  // `dist/`, which deploy/deploy.sh ships to the server. No SSR runtime.
});
