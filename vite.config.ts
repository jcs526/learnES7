import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
const prefix: string = "monaco-editor/esm/vs";
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    }, build: {
      assetsDir: process.env.NODE_ENV === "production" ? "vue_es7" : "",
      rollupOptions: {
        output: {
          manualChunks: {
            jsonWorker: [`${prefix}/language/json/json.worker`],
            cssWorker: [`${prefix}/language/css/css.worker`],
            htmlWorker: [`${prefix}/language/html/html.worker`],
            tsWorker: [`${prefix}/language/typescript/ts.worker`],
            editorWorker: [`${prefix}/editor/editor.worker`],
          },
        },
      },
    },
  };
});
