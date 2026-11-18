# Flymedia

Apartment discovery and rental marketplace for Nigeria. Built with Nuxt 4, Vue 3, TypeScript and Tailwind CSS v4.

**Current stage: static website.** All data is local sample data in `app/data/`. There is no backend or API yet.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run generate   # static site in .output/public
```

## What works now (in the browser)

- Search with filters for location (state → city → area), type, price, bedrooms, bathrooms, furnishing, servicing, new builds, verified homes and amenities. Filters live in the URL, so every search is shareable.
- Sorting, grid/list view, pagination, active-filter chips and a mobile filter drawer.
- Listing pages with gallery and lightbox, itemised charges and move-in total, availability panel, and agent contact (call / WhatsApp links).
- Availability freshness rules (`app/utils/availability.ts`): after 7 days without confirmation a listing shows "Awaiting confirmation"; after 7 more it is hidden. Rented listings are never shown as available. Intervals live in `app/data/settings.ts`.
- Saved homes, kept in `localStorage`.
- Agent directory with filters and agent profiles.
- Multi-step "List a property" form, apartment request, contact, login and sign-up forms, all validated.

## Preview-only (not connected yet)

Form submissions (enquiries, inspections, listing submission, requests, contact, login and sign-up) validate input and show a confirmation, but nothing is sent or stored. Each of these forms shows a notice saying so. Agent phone numbers use the placeholder `0800 000 xxxx` range.

## Structure

```
app/
  data/          sample listings, agents, locations, catalogue, settings
  utils/         formatting, availability and move-in cost logic
  composables/   search/filter engine, saved homes, toasts
  components/    UI (ListingCard, SearchFilters, ListingGallery, ...)
  pages/         routes
server/routes/sitemap.xml.ts
public/images/   photography (Unsplash licence)
```
