// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: "https://bolstatech.com",

  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
    partytown(),
  ],

  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
