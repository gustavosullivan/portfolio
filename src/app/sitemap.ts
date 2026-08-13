import type { MetadataRoute } from "next";

const SITE_URL = "https://www.gudev.com.br";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [`${SITE_URL}/icon-512.png`, `${SITE_URL}/favicon-48.png`],
    },
  ];
}
