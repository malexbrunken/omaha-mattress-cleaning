import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://omahamattresscleaning.com',
  compressHTML: true,
  build: {
    format: 'file'
  }
});
