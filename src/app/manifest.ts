import type { MetadataRoute } from "next";

/** PWA manifest — installable on iOS & Android. Served at /manifest.webmanifest. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Good Decisions",
    short_name: "Good Decisions",
    description:
      "Your friendly financial coach for young Singaporeans. Learn, plan, and make good money decisions with confidence.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf4f6",
    theme_color: "#ec4f8a",
    orientation: "portrait",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      {
        src: "/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
