import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "P'tit Paris",
    short_name: "P'tit Paris",
    description: "La carte, le sommelier IA et la réservation de P'tit Paris, Ouagadougou.",
    start_url: "/",
    display: "standalone",
    background_color: "#3b060c",
    theme_color: "#5c0c16",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
