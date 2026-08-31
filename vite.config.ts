import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the built app can be dropped on any static host or subpath.
export default defineConfig({
  base: './',
  plugins: [react()],
});
