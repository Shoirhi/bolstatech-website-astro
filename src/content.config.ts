import { defineCollection, z, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { microCMSContentLoader } from "microcms-astro-loader";

const navigation = defineCollection({
  loader: file("src/data/navigation.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    path: z.string(),
    description: z.string(),
    children: z
      .array(
        z.object({
          title: z.string(),
          path: z.string(),
          description: z.string(),
          archive: z.boolean().default(false),
        })
      )
      .optional(),
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

const blogCategories = defineCollection({
  loader: microCMSContentLoader({
    apiKey: import.meta.env.MICROCMS_API_KEY,
    serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
    endpoint: "blog-categories",
  }),
});

const freeWebToolCategories = defineCollection({
  loader: file("src/data/free-web-tool-categories.json"),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    archive: z.boolean().default(false),
  }),
});

const freeWebTools = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/data/free-web-tools" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: reference("freeWebToolCategories"),
    url: z.string(),
    addedDate: z.string().transform((str) => new Date(str)),
    archive: z.boolean().default(false),
  }),
});

export const collections = { navigation, blog, blogCategories, freeWebToolCategories, freeWebTools };
