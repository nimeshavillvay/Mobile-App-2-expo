import { PRODUCTION_URL } from "@/_lib/constants";
import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: [
      {
        userAgent: "*",
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
        ],
      },
      {
        userAgent: "MJ12bot",
        disallow: "/",
      },
    ],
    host: PRODUCTION_URL,
    sitemap: `${PRODUCTION_URL}/sitemap.xml`,
  };
};

export default robots;
