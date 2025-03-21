// @ts-check
import { defineConfig, envField } from "astro/config";

import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

import partytown from "@astrojs/partytown";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://bolstatech.com",
  vite: {
    resolve: {
      // React 19での「MessageChannel」エラーを回避するための設定。https://github.com/facebook/react/issues/31827
      alias: import.meta.env.PROD
        ? {
            "react-dom/server": "react-dom/server.edge",
          }
        : undefined,
    },
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
      MICROCMS_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      MICROCMS_SERVICE_DOMAIN: envField.string({
        context: "client",
        access: "public",
      }),
    },
  },

  integrations: [react(), sitemap(), mdx(), partytown()],

  adapter: cloudflare(),
});
