import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";
import { microCMSContentLoader } from "microcms-astro-loader";

const navigation = defineCollection({
  loader: file("src/data/navigation.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    path: z.string(),
    description: z.string(),
    children: z.array(
      z.object({
        title: z.string(),
        path: z.string(),
        description: z.string(),
        archive: z.boolean().default(false),
      })
    ).optional(),
    archive: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: microCMSContentLoader({
    apiKey: import.meta.env.MICROCMS_API_KEY,
    serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
    endpoint: "blog",
  }),
});

export const collections = { navigation, blog };
