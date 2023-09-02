import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/cn_js_superhero-hunter/',
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'), // Home page
        superhero: resolve(__dirname, 'superhero.html'), // Superhero page
        favorites: resolve(__dirname, 'favorites.html'), // Favorites page
      },
    },
  },
});
