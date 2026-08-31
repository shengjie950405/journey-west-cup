import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import netlify from '@netlify/vite-plugin';
import { mockApi } from './scripts/mock-api';

// `netlify` emulates Blobs and Functions when running `netlify dev`.
// `mockApi` is a pure in-memory stand-in used by `npm run dev` / `preview` and
// the smoke suite; neither ships in the built site.
export default defineConfig({
  base: './',
  plugins: [react(), netlify(), mockApi()],
});
