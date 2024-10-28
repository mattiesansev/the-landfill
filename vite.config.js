import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    base: "/dist/",
    outDir: "dist",
    assetsDir: "assets",
    copyPublicDir: true,
    modulePreload: true,
    target: "esnext",
  },
})
