import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5001,
    strictPort: true,
    cors: {
      origin: "*",
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 5001,
    strictPort: true,
  },
  build: {
    lib: {
      entry: "src/widget.jsx",
      name: "HomesfyChat",
      fileName: () => "widget.js",
      formats: ["umd"],
    },
    rollupOptions: {
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
    minify: true,
    sourcemap: true,
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});


