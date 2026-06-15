import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Served from https://sherine0113.github.io/Memory-Beads/ on GitHub Pages.
  base: '/Memory-Beads/',
  plugins: [react()],
});
