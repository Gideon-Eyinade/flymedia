import type { Listing } from '~/types'
import { listings } from '~/data/listings'
import { findArea, findState, findCity, allAreas } from '~/data/locations'
import { findType, amenityName } from '~/data/catalog'
import { platformSettings } from '~/data/settings'

export type SortKey = 'newest' | 'updated' | 'price_asc' | 'price_desc' | 'popular'

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Most recently added' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'price_asc', label: 'Lowest price' },
  { value: 'price_desc', label: 'Highest price' },
  { value: 'popular', label: 'Most popular' },
]

export interface SearchFilters {
  q: string
  state: string
  city: string
  area: string
  type: string
  beds: string // minimum, '' = any
  baths: string
  min: string
  max: string
  furnishing: string
  serviced: string // '1' | '0' | ''
  newbuild: string // '1' | ''
  verified: string // '1' | ''
  amenities: string[]
  sort: SortKey
  view: 'grid' | 'list'
  page: number
}

const emptyFilters = (): SearchFilters => ({
  q: '',
  state: '',
  city: '',
  area: '',
  type: '',
  beds: '',
  baths: '',
  min: '',
  max: '',
  furnishing: '',
  serviced: '',
  newbuild: '',
  verified: '',
  amenities: [],
  sort: 'newest',
  view: 'grid',
  page: 1,
})

function str(v: unknown) {
  return typeof v === 'string' ? v : Array.isArray(v) && typeof v[0] === 'string' ? v[0] : ''
}

export function filtersFromQuery(query: Record<string, unknown>): SearchFilters {
  const f = emptyFilters()
  f.q = str(query.q)
  f.state = str(query.state)
  f.city = str(query.city)
  f.area = str(query.area)
  // Selecting an area implies its city and state
  const area = findArea(f.area)
  if (area) {
    f.state = area.state
    f.city = area.city
  }
  f.type = str(query.type)
  f.beds = str(query.beds)
  f.baths = str(query.baths)
  f.min = str(query.min).replace(/\D/g, '')
  f.max = str(query.max).replace(/\D/g, '')
  f.furnishing = str(query.furnishing)
  f.serviced = str(query.serviced)
  f.newbuild = str(query.newbuild)
  f.verified = str(query.verified)
  f.amenities = str(query.amenities).split(',').filter(Boolean)
  const sort = str(query.sort) as SortKey
  f.sort = sortOptions.some((o) => o.value === sort) ? sort : 'newest'
  f.view = str(query.view) === 'list' ? 'list' : 'grid'
  f.page = Math.max(1, Number.parseInt(str(query.page)) || 1)
  return f
}

export function filtersToQuery(f: SearchFilters) {
  const q: Record<string, string> = {}
  if (f.q.trim()) q.q = f.q.trim()
  if (f.area) q.area = f.area
  else {
    if (f.state) q.state = f.state
    if (f.city) q.city = f.city
  }
  if (f.type) q.type = f.type
  if (f.beds) q.beds = f.beds
  if (f.baths) q.baths = f.baths
  if (f.min) q.min = f.min
  if (f.max) q.max = f.max
  if (f.furnishing) q.furnishing = f.furnishing
  if (f.serviced) q.serviced = f.serviced
  if (f.newbuild) q.newbuild = f.newbuild
  if (f.verified) q.verified = f.verified
  if (f.amenities.length) q.amenities = f.amenities.join(',')
  if (f.sort !== 'newest') q.sort = f.sort
  if (f.view !== 'grid') q.view = f.view
  if (f.page > 1) q.page = String(f.page)
  return q
}

/** Annual-equivalent rent so monthly and yearly rents compare fairly */
export function annualRent(l: Listing) {
  return l.period === 'month' ? l.rent * 12 : l.rent
}

function matchesKeyword(l: Listing, q: string) {
  if (!q) return true
  const area = findArea(l.area)
  const type = findType(l.type)
  const hay = [l.title, l.neighbourhood, l.street, area?.name, area?.cityName, area?.stateName, type?.name, l.id, ...l.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word))
}

export function applyFilters(all: Listing[], f: SearchFilters) {
  const min = f.min ? Number(f.min) : null
  const max = f.max ? Number(f.max) : null
  return all.filter((l) => {
    if (!isDiscoverable(l)) return false
    if (f.area && l.area !== f.area) return false
    if (!f.area && f.city && l.city !== f.city) return false
    if (!f.area && f.state && l.state !== f.state) return false
    if (f.type && l.type !== f.type) return false
    if (f.beds && l.bedrooms < Number(f.beds)) return false
    if (f.baths && l.bathrooms < Number(f.baths)) return false
    const rent = annualRent(l)
    if (min !== null && rent < min) return false
    if (max !== null && rent > max) return false
    if (f.furnishing && l.furnishing !== f.furnishing) return false
    if (f.serviced === '1' && !l.serviced) return false
    if (f.serviced === '0' && l.serviced) return false
    if (f.newbuild === '1' && l.condition !== 'newly_built') return false
    if (f.verified === '1' && !l.verified) return false
    if (f.amenities.length && !f.amenities.every((a) => l.amenities.includes(a))) return false
    return matchesKeyword(l, f.q)
  })
}

export function sortListings(list: Listing[], sort: SortKey) {
  const copy = [...list]
  switch (sort) {
    case 'updated':
      return copy.sort((a, b) => Math.min(a.updatedDaysAgo, a.confirmedDaysAgo) - Math.min(b.updatedDaysAgo, b.confirmedDaysAgo))
    case 'price_asc':
      return copy.sort((a, b) => annualRent(a) - annualRent(b))
    case 'price_desc':
      return copy.sort((a, b) => annualRent(b) - annualRent(a))
    case 'popular':
      return copy.sort((a, b) => b.views + b.saves * 10 - (a.views + a.saves * 10))
    default:
      return copy.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo || b.views - a.views)
  }
}

export interface ActiveChip {
  key: string
  label: string
  clear: (f: SearchFilters) => void
}

export function activeChips(f: SearchFilters): ActiveChip[] {
  const chips: ActiveChip[] = []
  if (f.q) chips.push({ key: 'q', label: `“${f.q}”`, clear: (x) => (x.q = '') })
  if (f.area) {
    chips.push({ key: 'area', label: findArea(f.area)?.name ?? f.area, clear: (x) => (x.area = '') })
  } else if (f.city) {
    chips.push({ key: 'city', label: findCity(f.city)?.name ?? f.city, clear: (x) => (x.city = '') })
  } else if (f.state) {
    chips.push({ key: 'state', label: findState(f.state)?.name ?? f.state, clear: (x) => (x.state = '') })
  }
  if (f.type) chips.push({ key: 'type', label: findType(f.type)?.name ?? f.type, clear: (x) => (x.type = '') })
  if (f.beds) chips.push({ key: 'beds', label: `${f.beds}+ bedrooms`, clear: (x) => (x.beds = '') })
  if (f.baths) chips.push({ key: 'baths', label: `${f.baths}+ bathrooms`, clear: (x) => (x.baths = '') })
  if (f.min) chips.push({ key: 'min', label: `From ${formatNairaCompact(Number(f.min))}`, clear: (x) => (x.min = '') })
  if (f.max) chips.push({ key: 'max', label: `Up to ${formatNairaCompact(Number(f.max))}`, clear: (x) => (x.max = '') })
  if (f.furnishing)
    chips.push({
      key: 'furnishing',
      label: { furnished: 'Furnished', semi_furnished: 'Semi-furnished', unfurnished: 'Unfurnished' }[f.furnishing] ?? f.furnishing,
      clear: (x) => (x.furnishing = ''),
    })
  if (f.serviced) chips.push({ key: 'serviced', label: f.serviced === '1' ? 'Serviced' : 'Not serviced', clear: (x) => (x.serviced = '') })
  if (f.newbuild) chips.push({ key: 'newbuild', label: 'Newly built', clear: (x) => (x.newbuild = '') })
  if (f.verified) chips.push({ key: 'verified', label: 'Flymedia verified', clear: (x) => (x.verified = '') })
  for (const a of f.amenities) {
    chips.push({ key: `amenity-${a}`, label: amenityName(a), clear: (x) => (x.amenities = x.amenities.filter((y) => y !== a)) })
  }
  return chips
}

export function useListingSearch() {
  const route = useRoute()
  const router = useRouter()

  const filters = computed(() => filtersFromQuery(route.query))
  const matched = computed(() => sortListings(applyFilters(listings, filters.value), filters.value.sort))
  const pageSize = platformSettings.pageSize
  const totalPages = computed(() => Math.max(1, Math.ceil(matched.value.length / pageSize)))
  const page = computed(() => Math.min(filters.value.page, totalPages.value))
  const results = computed(() => matched.value.slice((page.value - 1) * pageSize, page.value * pageSize))
  const chips = computed(() => activeChips(filters.value))

  function update(mutator: (f: SearchFilters) => void, opts: { resetPage?: boolean } = {}) {
    const next = filtersFromQuery(route.query)
    mutator(next)
    if (opts.resetPage !== false) next.page = 1
    router.push({ query: filtersToQuery(next) })
  }

  function clearAll() {
    const cur = filters.value
    router.push({ query: filtersToQuery({ ...emptyFilters(), sort: cur.sort, view: cur.view }) })
  }

  return { filters, matched, results, totalPages, page, pageSize, chips, update, clearAll }
}

/** Build a /apartments link with the given filters */
export function searchLink(partial: Partial<SearchFilters>) {
  return { path: '/apartments', query: filtersToQuery({ ...emptyFilters(), ...partial }) }
}

/** Typeahead suggestions for the location box */
export function locationSuggestions(term: string, limit = 8) {
  const t = term.trim().toLowerCase()
  if (!t) return []
  const out: { label: string; sub: string; area: string }[] = []
  for (const a of allAreas) {
    if (a.name.toLowerCase().includes(t)) out.push({ label: a.name, sub: `${a.cityName}, ${a.stateName}`, area: a.slug })
    for (const n of a.neighbourhoods) {
      if (n.toLowerCase().includes(t) && n.toLowerCase() !== a.name.toLowerCase()) {
        out.push({ label: n, sub: `${a.name}, ${a.cityName}`, area: a.slug })
      }
    }
  }
  return out.slice(0, limit)
}
