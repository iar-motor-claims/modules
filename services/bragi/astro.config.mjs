import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://modules.iarservices.in",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
