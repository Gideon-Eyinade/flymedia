import { listings } from '~~/app/data/listings'
import { agents } from '~~/app/data/agents'
import { effectiveStatus } from '~~/app/utils/availability'

// Static sitemap generated from the sample data. Prerendered at build time.
export default defineEventHandler((event) => {
  const origin = getRequestURL(event).origin
  const staticPaths = ['/', '/apartments', '/locations', '/property-types', '/agents', '/list-property', '/request', '/about', '/contact', '/faq', '/privacy', '/terms']
  const listingPaths = listings
    .filter((l) => ['available', 'awaiting_confirmation', 'inspection_ongoing'].includes(effectiveStatus(l)))
    .map((l) => `/apartments/${l.slug}`)
  const agentPaths = agents.map((a) => `/agents/${a.slug}`)
  const urls = [...staticPaths, ...listingPaths, ...agentPaths]
    .map((p) => `  <url><loc>${origin}${p}</loc></url>`)
    .join('\n')
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
