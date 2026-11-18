import type { State } from '~/types'

export const states: State[] = [
  {
    slug: 'lagos',
    name: 'Lagos',
    cities: [
      {
        slug: 'lagos',
        name: 'Lagos',
        areas: [
          {
            slug: 'lekki',
            name: 'Lekki',
            neighbourhoods: ['Lekki Phase 1', 'Ikate', 'Chevron', 'Osapa London', 'Agungi', 'Jakande'],
            blurb: 'Gated estates, new builds and quick access to VI and Ikoyi.',
          },
          {
            slug: 'ajah',
            name: 'Ajah',
            neighbourhoods: ['Abraham Adesanya', 'Badore', 'Sangotedo', 'Thomas Estate', 'Addo'],
            blurb: 'More space for your budget along the Lekki–Epe corridor.',
          },
          {
            slug: 'ikoyi',
            name: 'Ikoyi',
            neighbourhoods: ['Old Ikoyi', 'Parkview Estate', 'Banana Island', 'Osborne Foreshore'],
            blurb: 'Quiet, leafy streets and premium serviced apartments.',
          },
          {
            slug: 'victoria-island',
            name: 'Victoria Island',
            neighbourhoods: ['Oniru', 'Adeola Odeku', 'Ahmadu Bello Way', 'Oniru Estate'],
            blurb: 'Live close to the offices, restaurants and the beach.',
          },
          {
            slug: 'yaba',
            name: 'Yaba',
            neighbourhoods: ['Sabo', 'Alagomeji', 'Akoka', 'Onike', 'Jibowu'],
            blurb: 'Close to UNILAG, tech hubs and the Third Mainland Bridge.',
          },
          {
            slug: 'ikeja',
            name: 'Ikeja',
            neighbourhoods: ['Ikeja GRA', 'Allen Avenue', 'Opebi', 'Alausa', 'Oregun'],
            blurb: 'The state capital, minutes from the airport.',
          },
          {
            slug: 'surulere',
            name: 'Surulere',
            neighbourhoods: ['Adeniran Ogunsanya', 'Bode Thomas', 'Aguda', 'Ijesha'],
            blurb: 'Established neighbourhoods with good mainland links.',
          },
          {
            slug: 'gbagada',
            name: 'Gbagada',
            neighbourhoods: ['Gbagada Phase 1', 'Gbagada Phase 2', 'Ifako', 'Soluyi'],
            blurb: 'Central mainland living between Ikeja and the Island.',
          },
          {
            slug: 'maryland',
            name: 'Maryland',
            neighbourhoods: ['Mende', 'Anthony Village', 'Onigbongbo'],
            blurb: 'A short ride to Ikeja, Yaba and Ikorodu Road.',
          },
          {
            slug: 'magodo',
            name: 'Magodo',
            neighbourhoods: ['Magodo Phase 1', 'Magodo Phase 2 (Shangisha)'],
            blurb: 'Secure, planned estates with larger family homes.',
          },
        ],
      },
    ],
  },
  {
    slug: 'abuja',
    name: 'Abuja (FCT)',
    cities: [
      {
        slug: 'abuja',
        name: 'Abuja',
        areas: [
          {
            slug: 'wuse-2',
            name: 'Wuse 2',
            neighbourhoods: ['Adetokunbo Ademola', 'Aminu Kano Crescent', 'Banex'],
            blurb: 'Abuja’s busiest district for work, shopping and dining.',
          },
          {
            slug: 'gwarinpa',
            name: 'Gwarinpa',
            neighbourhoods: ['1st Avenue', '3rd Avenue', '6th Avenue', 'Gwarinpa Estate'],
            blurb: 'Large, family-friendly estate with good value rents.',
          },
          {
            slug: 'jabi',
            name: 'Jabi',
            neighbourhoods: ['Jabi Lake', 'Jabi District'],
            blurb: 'Modern apartments near the lake and Jabi mall.',
          },
          {
            slug: 'maitama',
            name: 'Maitama',
            neighbourhoods: ['Maitama District', 'Mississippi Street'],
            blurb: 'Diplomatic district with premium homes.',
          },
        ],
      },
    ],
  },
  {
    slug: 'rivers',
    name: 'Rivers',
    cities: [
      {
        slug: 'port-harcourt',
        name: 'Port Harcourt',
        areas: [
          {
            slug: 'old-gra',
            name: 'Old GRA',
            neighbourhoods: ['Forces Avenue', 'Harley Street'],
            blurb: 'Established, central and close to the city’s offices.',
          },
          {
            slug: 'gra-phase-2',
            name: 'GRA Phase 2',
            neighbourhoods: ['Tombia Street', 'Olu Obasanjo Road'],
            blurb: 'Popular with professionals working in oil and gas.',
          },
        ],
      },
    ],
  },
  {
    slug: 'oyo',
    name: 'Oyo',
    cities: [
      {
        slug: 'ibadan',
        name: 'Ibadan',
        areas: [
          {
            slug: 'bodija',
            name: 'Bodija',
            neighbourhoods: ['Old Bodija', 'New Bodija'],
            blurb: 'Quiet residential area near UI and the city centre.',
          },
          {
            slug: 'jericho',
            name: 'Jericho',
            neighbourhoods: ['Jericho GRA', 'Idi-Ishin'],
            blurb: 'Leafy GRA streets with larger compounds.',
          },
        ],
      },
    ],
  },
]

export const popularAreaSlugs = [
  'lekki',
  'ajah',
  'yaba',
  'ikeja',
  'surulere',
  'gbagada',
  'maryland',
  'ikoyi',
  'victoria-island',
  'magodo',
]

export interface FlatArea {
  slug: string
  name: string
  blurb: string
  neighbourhoods: string[]
  city: string
  cityName: string
  state: string
  stateName: string
}

export const allAreas: FlatArea[] = states.flatMap((s) =>
  s.cities.flatMap((c) =>
    c.areas.map((a) => ({
      ...a,
      city: c.slug,
      cityName: c.name,
      state: s.slug,
      stateName: s.name,
    })),
  ),
)

export function findArea(slug?: string) {
  return allAreas.find((a) => a.slug === slug)
}

export function findState(slug?: string) {
  return states.find((s) => s.slug === slug)
}

export function findCity(slug?: string) {
  for (const s of states) {
    const c = s.cities.find((c) => c.slug === slug)
    if (c) return c
  }
}
