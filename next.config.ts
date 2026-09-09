import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Les photos viennent de /photos (dépôt), /media (base) ou d'un lien https saisi dans le centre de contrôle.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
