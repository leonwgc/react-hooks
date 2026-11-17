import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
export default defineConfig({
  root: "website",
  base: "/react-hooks/",
  plugins: [mdx(), react()],
  build: { outDir: "../docs", emptyOutDir: true },
  server: { host: "127.0.0.1", port: 5173 },
});
