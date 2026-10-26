import { defineConfig } from 'astro/config';
import remarkPriceTokens from './src/plugins/remark-price-tokens.ts';

export default defineConfig({
  output: 'static',
  site: 'https://omahamattresscleaning.com',
  compressHTML: true,
  markdown: { remarkPlugins: [remarkPriceTokens] },
  build: {
    format: 'file'
  }
});
