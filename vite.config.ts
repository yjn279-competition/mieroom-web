import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('leaflet')) {
              return 'leaflet';
            }
            if (id.includes('lucide-react')) {
              return 'lucide';
            }
            if (id.includes('recharts')) {
              return 'recharts';
            }
            if (id.includes('@radix-ui')) {
              return 'radix';
            }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 2000,
    sourcemap: false,
    minify: 'esbuild',
  },
  optimizeDeps: {
    include: [
      'leaflet',
      'react-leaflet',
      'lucide-react',
      'recharts',
      'qrcode.react',
    ],
    force: true,
  },
});
