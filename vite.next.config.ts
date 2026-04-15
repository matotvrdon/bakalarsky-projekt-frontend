import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || "http://localhost:5010"),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src-next"),
    },
  },
  assetsInclude: ["**/*.svg", "**/*.csv"],
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "index.next.html"),
    },
  },
});
