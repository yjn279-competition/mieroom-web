import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from "@react-router/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/cloudflare" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
