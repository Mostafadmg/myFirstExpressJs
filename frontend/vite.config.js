import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { codeInspectorPlugin } from "code-inspector-plugin";

const workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Vite config: tells Vite which plugin to use to understand JSX/React
// and (later) lets you set a dev-server proxy to your Express API so
// you can call fetch("/api/...") instead of hardcoding a full URL.
export default defineConfig({
  plugins: [
    codeInspectorPlugin({
      bundler: "vite",
      editor: "cursor",
      hotKeys: ["altKey"],
      openIn: "reuse",
      workspace,
    }),
    react(),
  ],
});
