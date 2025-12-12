import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      // КРИТИЧЕСКОЕ ИЗМЕНЕНИЕ: отключаем fast refresh полностью
      fastRefresh: false
    })
  ],
  server: {
    host: "127.0.0.1",  // Используем конкретный IP
    port: 3000,          // Меняем порт
    strictPort: true,    // Не ищем свободный порт
    hmr: false,          // ОТКЛЮЧАЕМ HMR полностью
    watch: {
      usePolling: true   // Для Windows может помочь
    }
  },
  build: {
    target: "es2020"
  },
  clearScreen: false
});
