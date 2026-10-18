import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Pustaka dipisah agar tetap tersimpan di cache browser saat isi website diperbarui
        manualChunks: { react: ["react", "react-dom", "react-router-dom", "react-helmet-async"], supabase: ["@supabase/supabase-js"] },
      },
    },
  },
});
