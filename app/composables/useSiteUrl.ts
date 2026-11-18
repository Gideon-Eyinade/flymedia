/**
 * Absolute URLs for meta tags, canonical links, JSON-LD and the sitemap.
 * Link-preview bots (WhatsApp, Facebook, X, Slack) ignore relative og:image
 * paths, and at `nuxt generate` time the request origin is localhost, so the
 * public origin comes from NUXT_PUBLIC_SITE_URL instead.
 */
export function useSiteUrl() {
  const base = String(useRuntimeConfig().public.siteUrl || useRequestURL().origin).replace(/\/+$/, '')
  return (path = '/') => (/^https?:\/\//.test(path) ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`)
}
