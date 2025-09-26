import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import express from 'express';
import cashfreeCreateOrderHandler from './api/cashfree-create-order';
import cashfreeVerifyHandler from './api/cashfree-verify';
import subscribeHandler from './subscribe';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: 'local-api',
      configureServer(server) {
        const app = express();
        app.use(express.json());
        app.post('/api/cashfree-create-order', cashfreeCreateOrderHandler);
        app.post('/api/cashfree-verify', cashfreeVerifyHandler);
        app.post('/api/subscribe', subscribeHandler);
        server.middlewares.use(app);
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
