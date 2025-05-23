import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    copyPublicDir: true,
    modulePreload: true,
    target: "esnext",
  },
  server: {
    historyApiFallback: true,
  },
})
