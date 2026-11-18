// Generated so the Sitemap line can carry the absolute site URL. Prerendered at build time.
export default defineEventHandler((event) => {
  const origin = String(useRuntimeConfig(event).public.siteUrl || getRequestURL(event).origin).replace(/\/+$/, '')
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return ['User-Agent: *', 'Disallow: /saved', 'Disallow: /login', 'Disallow: /signup', 'Disallow: /forgot-password', '', `Sitemap: ${origin}/sitemap.xml`, ''].join('\n')
})
