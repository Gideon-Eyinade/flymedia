import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      // Public origin used for absolute URLs in link previews, canonical tags and the sitemap.
      // Set NUXT_PUBLIC_SITE_URL=https://your-domain before `nuxt generate`.
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },
  nitro: {
    prerender: { crawlLinks: true, routes: ['/', '/sitemap.xml', '/robots.txt'] },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en-NG' },
      titleTemplate: '%s · Flymedia',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0c5f52' },
        { property: 'og:site_name', content: 'Flymedia' },
        { property: 'og:locale', content: 'en_NG' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap',
        },
      ],
    },
  },
})
