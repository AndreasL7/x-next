import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.cnbcfm.com",
        port: "**",
      },
      {
        protocol: "https",
        hostname: "a57.foxnews.com",
        port: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "**",
      },
    ],
    domains: [
      "image.cnbcfm.com",
      "a57.foxnews.com",
      "lh3.googleusercontent.com",
    ],
  },
};

export default nextConfig;
