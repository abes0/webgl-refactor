import { resolve } from "path";
import { defineConfig } from "vite";
import fs from "fs";

export default defineConfig({
  assetsInclude: ["**/*.gltf", "**/*.bin"],
  build: {
    rollupOptions: {
      //     output: {
      //       // entry chunk assets それぞれの書き出し名の指定
      //       // entryFileNames: `assets/[name].js`,
      //       chunkFileNames: `[name].js`,
      //       assetFileNames: `assets/[name].[ext]`,
      //     },
      input: {
        main: resolve(__dirname, "index.html"),
        nested: resolve(__dirname, "slider/index.html"),
      },
    },
  },
});
