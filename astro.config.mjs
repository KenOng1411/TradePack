// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// TODO: replace with the real production domain once purchased/confirmed.
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://tradepack.local';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko', 'de', 'vi', 'zh-hant'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          ko: 'ko',
          de: 'de',
          vi: 'vi',
          'zh-hant': 'zh-Hant',
        },
      },
    }),
  ],
});
