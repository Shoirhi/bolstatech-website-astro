import { defineCollection } from "astro:content";
import { microCMSContentLoader } from "microcms-astro-loader";

const blog = defineCollection({
  loader: microCMSContentLoader({
    apiKey: import.meta.env.MICROCMS_API_KEY,
    serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
    endpoint: "blog",
  }),
});

export const collections = { blog };