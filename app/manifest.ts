import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sunga — Every kwacha has a purpose",
    short_name: "Sunga",
    description: "A local-first money and Chilimba record keeper.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf3e7",
    theme_color: "#1b3b2f",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
