import type { Amenity, PropertyType } from '~/types'

export const propertyTypes: PropertyType[] = [
  {
    slug: 'self-contain',
    name: 'Self-contain',
    plural: 'Self-contained apartments',
    short: 'Self-contain',
    description: 'A single room with its own kitchenette, bathroom and toilet.',
    image: '/images/living-16-sm.jpg',
  },
  {
    slug: 'mini-flat',
    name: 'Mini flat',
    plural: 'Mini flats',
    short: 'Mini flat',
    description: 'Room and parlour with a separate kitchen, bathroom and toilet.',
    image: '/images/living-11-sm.jpg',
  },
  {
    slug: '1-bedroom',
    name: '1-bedroom apartment',
    plural: '1-bedroom apartments',
    short: '1 bedroom',
    description: 'One bedroom, a living room, kitchen and at least one bathroom.',
    image: '/images/living-1-sm.jpg',
  },
  {
    slug: '2-bedroom',
    name: '2-bedroom apartment',
    plural: '2-bedroom apartments',
    short: '2 bedroom',
    description: 'Two bedrooms, usually both en-suite, with a guest toilet.',
    image: '/images/living-8-sm.jpg',
  },
  {
    slug: '3-bedroom',
    name: '3-bedroom apartment',
    plural: '3-bedroom apartments',
    short: '3 bedroom',
    description: 'Three bedrooms for families or sharers, often with a BQ.',
    image: '/images/living-10-sm.jpg',
  },
  {
    slug: 'detached-house',
    name: 'Detached house',
    plural: 'Detached houses',
    short: 'Detached',
    description: 'A standalone house on its own plot with private compound.',
    image: '/images/house-5-sm.jpg',
  },
  {
    slug: 'terraced-duplex',
    name: 'Terraced duplex',
    plural: 'Terraced duplexes',
    short: 'Terrace',
    description: 'A two-storey home in a row of joined units.',
    image: '/images/house-7-sm.jpg',
  },
  {
    slug: 'semi-detached-duplex',
    name: 'Semi-detached duplex',
    plural: 'Semi-detached duplexes',
    short: 'Semi-detached',
    description: 'A duplex sharing one wall with its neighbour.',
    image: '/images/house-6-sm.jpg',
  },
  {
    slug: 'shared-apartment',
    name: 'Shared apartment',
    plural: 'Shared apartments',
    short: 'Shared',
    description: 'A private room in a shared flat with common living areas.',
    image: '/images/living-5-sm.jpg',
  },
  {
    slug: 'serviced-apartment',
    name: 'Serviced apartment',
    plural: 'Serviced apartments',
    short: 'Serviced',
    description: 'Managed apartments with power, cleaning and facility services.',
    image: '/images/living-14-sm.jpg',
  },
]

export const quickSearchTypes = ['self-contain', 'mini-flat', '1-bedroom', '2-bedroom', '3-bedroom', 'terraced-duplex']

export const amenities: Amenity[] = [
  { id: 'water', name: 'Treated water (borehole)', group: 'utilities' },
  { id: 'prepaid-meter', name: 'Prepaid electricity meter', group: 'utilities' },
  { id: '24h-power', name: '24-hour power', group: 'utilities' },
  { id: 'generator', name: 'Standby generator', group: 'utilities' },
  { id: 'inverter', name: 'Inverter / solar backup', group: 'utilities' },
  { id: 'security', name: '24-hour security', group: 'security' },
  { id: 'gated-estate', name: 'Gated estate', group: 'security' },
  { id: 'cctv', name: 'CCTV', group: 'security' },
  { id: 'parking', name: 'Parking space', group: 'building' },
  { id: 'elevator', name: 'Elevator', group: 'building' },
  { id: 'bq', name: 'Boys’ quarters (BQ)', group: 'building' },
  { id: 'pool', name: 'Swimming pool', group: 'building' },
  { id: 'gym', name: 'Gym', group: 'building' },
  { id: 'balcony', name: 'Balcony', group: 'comfort' },
  { id: 'ac', name: 'Air conditioning', group: 'comfort' },
  { id: 'fitted-kitchen', name: 'Fitted kitchen', group: 'comfort' },
  { id: 'wardrobes', name: 'Built-in wardrobes', group: 'comfort' },
  { id: 'water-heater', name: 'Water heater', group: 'comfort' },
  { id: 'pop-ceiling', name: 'POP ceiling', group: 'comfort' },
  { id: 'fibre', name: 'Fibre internet ready', group: 'comfort' },
]

/** Amenities shown as dedicated filters on the search page */
export const keyAmenityFilters = ['water', 'prepaid-meter', '24h-power', 'security', 'parking', 'generator']

export function findType(slug?: string) {
  return propertyTypes.find((t) => t.slug === slug)
}

export function amenityName(id: string) {
  return amenities.find((a) => a.id === id)?.name ?? id
}
