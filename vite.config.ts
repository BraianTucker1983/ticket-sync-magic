import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: "/", // Volvemos a la barra simple
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});