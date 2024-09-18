import { PRODUCTION_URL } from "@/_lib/constants";
import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
      {
        userAgent: ["Googlebot", "Bingbot"],
        allow: "/",
        disallow: [
          "/api/",
          "/myaccount/",
          "/cart/",
          "/checkout/",
          "/confirmation/",
          "/osr/",
          "/email/subscription-confirmation/",
          "/search/",
          "/laminate-finder/",
          "/no-bot/",
        ],
      },
    ],
    host: PRODUCTION_URL,
    sitemap: `${PRODUCTION_URL}/sitemap.xml`,
  };
};

export default robots;
