import type { BuildingCondition, Charge, Furnishing, Listing, RentPeriod, AvailabilityStatus } from '~/types'
import { findArea } from './locations'
import { findType } from './catalog'

/**
 * Sample listings for the static website. Every listing, price and address is
 * illustrative. In production this data comes from the database.
 */

interface Seed {
  id: string
  title: string
  type: string
  area: string
  hood: string
  street?: string
  rent: number
  period?: RentPeriod
  upfront?: number
  beds: number
  baths: number
  toilets: number
  sqm?: number
  furnishing: Furnishing
  serviced?: boolean
  condition: BuildingCondition
  amenities: string[]
  /** agency %, legal %, caution (₦), service charge per year (₦), extra one-time charges */
  fees: { agency?: number | { flat: number }; legal?: number; caution?: number; service?: number; other?: Charge[] }
  complete: boolean
  status?: AvailabilityStatus
  verified: boolean
  featured?: boolean
  posted: number
  updated?: number
  confirmed: number
  views: number
  saves: number
  agent: string
  video?: boolean
  images: string[]
  intro: string
}

const seeds: Seed[] = [
  {
    id: 'FM-10421', title: '2 Bedroom Apartment', type: '2-bedroom', area: 'lekki', hood: 'Lekki Phase 1', street: 'Off Admiralty Way',
    rent: 7_500_000, beds: 2, baths: 2, toilets: 3, sqm: 110, furnishing: 'unfurnished', condition: 'renovated',
    amenities: ['water', 'prepaid-meter', 'generator', 'security', 'gated-estate', 'parking', 'fitted-kitchen', 'wardrobes', 'pop-ceiling'],
    fees: { agency: 10, legal: 10, caution: 750_000, service: 800_000 }, complete: true,
    verified: true, featured: true, posted: 3, updated: 1, confirmed: 1, views: 1840, saves: 96, agent: 'a1', video: true,
    images: ['block-2', 'living-8', 'kitchen-1', 'bed-2', 'living-3'],
    intro: 'A bright, recently renovated two-bedroom flat on the second floor of a block of six, inside a quiet close off Admiralty Way. Both bedrooms are en-suite and there is a guest toilet off the living room.',
  },
  {
    id: 'FM-10422', title: 'Self-contain', type: 'self-contain', area: 'yaba', hood: 'Akoka', street: 'Community Road',
    rent: 900_000, beds: 1, baths: 1, toilets: 1, furnishing: 'unfurnished', condition: 'good',
    amenities: ['water', 'prepaid-meter', 'security'],
    fees: { agency: 10, legal: 10, caution: 100_000 }, complete: true,
    verified: true, posted: 1, confirmed: 0, views: 640, saves: 41, agent: 'a2',
    images: ['block-1', 'living-16', 'kitchen-2'],
    intro: 'A neat self-contained room with its own kitchenette, shower and toilet, a ten-minute walk from the UNILAG main gate. Ideal for a student or young professional.',
  },
  {
    id: 'FM-10423', title: 'Mini Flat', type: 'mini-flat', area: 'surulere', hood: 'Bode Thomas', street: 'Off Bode Thomas Street',
    rent: 1_800_000, beds: 1, baths: 1, toilets: 1, furnishing: 'unfurnished', condition: 'renovated',
    amenities: ['water', 'prepaid-meter', 'parking', 'pop-ceiling'],
    fees: { agency: 10, legal: 10, caution: 200_000 }, complete: true,
    verified: false, posted: 2, confirmed: 2, views: 512, saves: 22, agent: 'a10',
    images: ['block-4', 'living-11', 'kitchen-2', 'bed-1'],
    intro: 'Room and parlour with a separate kitchen in a compound of four flats. Freshly painted with new tiles and POP ceilings throughout.',
  },
  {
    id: 'FM-10424', title: '3 Bedroom Serviced Apartment', type: 'serviced-apartment', area: 'ikoyi', hood: 'Old Ikoyi', street: 'Bourdillon Road',
    rent: 38_000_000, beds: 3, baths: 3, toilets: 4, sqm: 210, furnishing: 'furnished', serviced: true, condition: 'newly_built',
    amenities: ['24h-power', 'water', 'security', 'cctv', 'elevator', 'pool', 'gym', 'ac', 'fitted-kitchen', 'wardrobes', 'water-heater', 'parking', 'bq', 'fibre'],
    fees: { agency: 10, legal: 10, caution: 2_000_000, service: 6_500_000 }, complete: true,
    verified: true, featured: true, posted: 5, updated: 1, confirmed: 1, views: 2310, saves: 188, agent: 'a9', video: true,
    images: ['house-10', 'living-14', 'kitchen-2', 'bed-1', 'living-12'],
    intro: 'A fully furnished three-bedroom apartment in a new 12-unit building on Bourdillon Road, with 24-hour power, a rooftop pool and an on-site facility team.',
  },
  {
    id: 'FM-10425', title: '4 Bedroom Semi-Detached Duplex with BQ', type: 'semi-detached-duplex', area: 'lekki', hood: 'Chevron', street: 'Chevron Drive',
    rent: 14_000_000, beds: 4, baths: 5, toilets: 5, sqm: 320, furnishing: 'unfurnished', condition: 'newly_built',
    amenities: ['gated-estate', 'security', 'water', 'prepaid-meter', 'parking', 'bq', 'fitted-kitchen', 'pop-ceiling', 'balcony'],
    fees: { agency: 10, legal: 10, caution: 1_000_000, service: 1_200_000 }, complete: true,
    verified: true, featured: true, posted: 4, confirmed: 3, views: 1420, saves: 104, agent: 'a1',
    images: ['house-6', 'living-9', 'kitchen-1', 'bed-1', 'living-4'],
    intro: 'A newly completed semi-detached duplex in a gated estate off Chevron Drive. All four bedrooms are en-suite, with a family lounge upstairs and a one-room BQ.',
  },
  {
    id: 'FM-10426', title: '2 Bedroom Flat', type: '2-bedroom', area: 'ajah', hood: 'Abraham Adesanya', street: 'Abraham Adesanya Estate',
    rent: 3_200_000, beds: 2, baths: 2, toilets: 3, furnishing: 'unfurnished', condition: 'newly_built',
    amenities: ['water', 'prepaid-meter', 'security', 'parking', 'pop-ceiling'],
    fees: { agency: 10, legal: 10, caution: 300_000, service: 250_000 }, complete: true,
    verified: false, posted: 1, confirmed: 1, views: 980, saves: 57, agent: 'a4',
    images: ['block-3', 'living-5', 'kitchen-1', 'bed-2'],
    intro: 'A brand-new two-bedroom flat, first tenants, in a block of eight inside Abraham Adesanya Estate. Five minutes from the expressway.',
  },
  {
    id: 'FM-10427', title: '1 Bedroom Apartment', type: '1-bedroom', area: 'lekki', hood: 'Ikate', street: 'Ikate Elegushi',
    rent: 4_800_000, beds: 1, baths: 1, toilets: 2, furnishing: 'semi_furnished', condition: 'renovated',
    amenities: ['water', 'prepaid-meter', 'generator', 'security', 'parking', 'ac', 'fitted-kitchen'],
    fees: { agency: 10, legal: 10, caution: 500_000, service: 600_000 }, complete: false,
    verified: true, posted: 6, confirmed: 2, views: 760, saves: 39, agent: 'a1',
    images: ['block-2', 'living-1', 'kitchen-2', 'bed-2'],
    intro: 'A semi-furnished one-bedroom with air conditioning in the bedroom and living room, a fitted kitchen and a guest toilet. Close to Elegushi beach and Lekki Phase 1.',
  },
  {
    id: 'FM-10428', title: '3 Bedroom Flat with BQ', type: '3-bedroom', area: 'gbagada', hood: 'Gbagada Phase 2', street: 'Gbagada Phase 2 Estate',
    rent: 5_500_000, beds: 3, baths: 3, toilets: 4, furnishing: 'unfurnished', condition: 'good',
    amenities: ['water', 'prepaid-meter', 'security', 'gated-estate', 'parking', 'bq'],
    fees: { agency: 10, legal: 10, caution: 500_000, service: 400_000 }, complete: true,
    status: 'inspection_ongoing', verified: true, posted: 9, confirmed: 1, views: 1105, saves: 63, agent: 'a3',
    images: ['block-4', 'living-10', 'kitchen-1', 'bed-1', 'living-2'],
    intro: 'Spacious three-bedroom ground-floor flat with a one-room BQ in Gbagada Phase 2. Prospective tenants are currently inspecting, but the agent is still taking enquiries.',
  },
  {
    id: 'FM-10429', title: '2 Bedroom Apartment', type: '2-bedroom', area: 'ikeja', hood: 'Ikeja GRA', street: 'Isaac John Street',
    rent: 6_500_000, beds: 2, baths: 2, toilets: 3, furnishing: 'unfurnished', condition: 'renovated',
    amenities: ['water', 'prepaid-meter', 'generator', 'security', 'parking', 'fitted-kitchen', 'wardrobes'],
    fees: { agency: 10, legal: 10, caution: 600_000, service: 500_000 }, complete: true,
    verified: true, featured: true, posted: 2, confirmed: 0, views: 870, saves: 52, agent: 'a3',
    images: ['block-1', 'living-4', 'kitchen-2', 'bed-2'],
    intro: 'A well-kept two-bedroom apartment on a quiet GRA street, fifteen minutes from the domestic airport. Shared generator runs at night.',
  },
  {
    id: 'FM-10430', title: 'Room in Shared Apartment', type: 'shared-apartment', area: 'yaba', hood: 'Sabo', street: 'Herbert Macaulay Way',
    rent: 75_000, period: 'month', upfront: 6, beds: 1, baths: 1, toilets: 1, furnishing: 'furnished', condition: 'good',
    amenities: ['water', 'prepaid-meter', 'fibre', 'security'],
    fees: { agency: { flat: 45_000 }, caution: 75_000 }, complete: true,
    verified: false, posted: 0, confirmed: 0, views: 220, saves: 18, agent: 'a2',
    images: ['living-5', 'bed-2', 'kitchen-2'],
    intro: 'A furnished private room in a three-bedroom flat shared with two working professionals. The kitchen and living room are shared and fibre internet is already installed.',
  },
  {
    id: 'FM-10431', title: '4 Bedroom Detached House', type: 'detached-house', area: 'magodo', hood: 'Magodo Phase 2 (Shangisha)', street: 'CMD Road axis',
    rent: 12_000_000, beds: 4, baths: 4, toilets: 5, sqm: 400, furnishing: 'unfurnished', condition: 'good',
    amenities: ['gated-estate', 'security', 'water', 'prepaid-meter', 'parking', 'bq', 'pop-ceiling', 'fitted-kitchen'],
    fees: { agency: 10, legal: 10, caution: 1_000_000, service: 500_000 }, complete: true,
    verified: true, posted: 7, confirmed: 4, views: 690, saves: 44, agent: 'a3',
    images: ['house-5', 'living-12', 'kitchen-1', 'bed-1'],
    intro: 'A standalone four-bedroom house with a large compound, two-room BQ and parking for four cars, inside Magodo Phase 2.',
  },
  {
    id: 'FM-10432', title: 'Mini Flat', type: 'mini-flat', area: 'maryland', hood: 'Mende', street: 'Mende Villa Estate',
    rent: 2_000_000, beds: 1, baths: 1, toilets: 1, furnishing: 'unfurnished', condition: 'renovated',
    amenities: ['water', 'prepaid-meter', 'security', 'parking'],
    fees: { agency: 10, legal: 10, caution: 200_000 }, complete: true,
    verified: false, posted: 15, updated: 9, confirmed: 9, views: 430, saves: 19, agent: 'a10',
    images: ['block-3', 'living-2', 'kitchen-2'],
    intro: 'Room and parlour on the first floor inside Mende Villa Estate. Recently repainted, with a new prepaid meter.',
  },
  {
    id: 'FM-10433', title: '3 Bedroom Terraced Duplex', type: 'terraced-duplex', area: 'lekki', hood: 'Osapa London', street: 'Osapa London Estate',
    rent: 11_000_000, beds: 3, baths: 3, toilets: 4, sqm: 240, furnishing: 'unfurnished', condition: 'newly_built',
    amenities: ['gated-estate', 'security', 'water', 'prepaid-meter', 'parking', 'bq', 'fitted-kitchen', 'balcony', 'pop-ceiling'],
    fees: { agency: 10, legal: 10, caution: 1_000_000, service: 1_500_000 }, complete: true,
    verified: true, posted: 3, confirmed: 2, views: 1210, saves: 88, agent: 'a1',
    images: ['house-7', 'living-13', 'kitchen-1', 'bed-1'],
    intro: 'A new three-bedroom terraced duplex in a row of five, with a balcony off the master bedroom and a one-room BQ. The estate has a central borehole and treatment plant.',
  },
  {
    id: 'FM-10434', title: '1 Bedroom Serviced Apartment', type: 'serviced-apartment', area: 'victoria-island', hood: 'Oniru', street: 'Oniru Estate',
    rent: 9_500_000, beds: 1, baths: 1, toilets: 2, sqm: 75, furnishing: 'furnished', serviced: true, condition: 'newly_built',
    amenities: ['24h-power', 'water', 'elevator', 'gym', 'security', 'cctv', 'ac', 'fitted-kitchen', 'wardrobes', 'water-heater', 'fibre', 'parking'],
    fees: { agency: 10, legal: 10, caution: 1_000_000, service: 3_000_000 }, complete: true,
    verified: true, featured: true, posted: 2, confirmed: 0, views: 1630, saves: 121, agent: 'a9',
    images: ['living-14', 'bed-1', 'kitchen-2', 'living-6'],
    intro: 'A furnished one-bedroom in a serviced building in Oniru, a short walk from Landmark and the beach. Power, diesel, cleaning of common areas and facility management are covered by the service charge.',
  },
  {
    id: 'FM-10435', title: '2 Bedroom Flat', type: '2-bedroom', area: 'surulere', hood: 'Adeniran Ogunsanya', street: 'Off Adeniran Ogunsanya',
    rent: 3_500_000, beds: 2, baths: 2, toilets: 3, furnishing: 'unfurnished', condition: 'good',
    amenities: ['water', 'prepaid-meter', 'security', 'parking'],
    fees: { agency: 10, legal: 10, caution: 350_000 }, complete: true,
    verified: false, posted: 4, confirmed: 4, views: 590, saves: 27, agent: 'a10',
    images: ['block-4', 'living-3', 'kitchen-1', 'bed-2'],
    intro: 'Two-bedroom flat in a compound of six, walking distance from Shoprite Surulere. Both rooms are en-suite.',
  },
  {
    id: 'FM-10436', title: 'Self-contain', type: 'self-contain', area: 'ajah', hood: 'Badore', street: 'Badore Road',
    rent: 650_000, beds: 1, baths: 1, toilets: 1, furnishing: 'unfurnished', condition: 'newly_built',
    amenities: ['water', 'prepaid-meter'],
    fees: { agency: 10, legal: 10, caution: 50_000 }, complete: true,
    verified: false, posted: 2, confirmed: 2, views: 470, saves: 31, agent: 'a4',
    images: ['block-3', 'living-16', 'kitchen-2'],
    intro: 'A newly built self-contain in a compound of ten units off Badore Road. Each unit has its own prepaid meter.',
  },
  {
    id: 'FM-10437', title: '3 Bedroom Apartment', type: '3-bedroom', area: 'wuse-2', hood: 'Aminu Kano Crescent', street: 'Off Aminu Kano Crescent',
    rent: 9_000_000, beds: 3, baths: 3, toilets: 4, furnishing: 'unfurnished', condition: 'renovated',
    amenities: ['generator', 'water', 'security', 'parking', 'elevator', 'bq', 'fitted-kitchen', 'ac'],
    fees: { agency: 10, legal: 10, caution: 900_000, service: 1_800_000 }, complete: true,
    verified: true, posted: 5, confirmed: 1, views: 820, saves: 49, agent: 'a5',
    images: ['block-1', 'living-9', 'kitchen-1', 'bed-1'],
    intro: 'A three-bedroom apartment with a BQ in a well-run building off Aminu Kano Crescent, close to Banex and Wuse market.',
  },
  {
    id: 'FM-10438', title: '4 Bedroom Terraced Duplex', type: 'terraced-duplex', area: 'gwarinpa', hood: '6th Avenue', street: '6th Avenue, Gwarinpa',
    rent: 6_500_000, beds: 4, baths: 4, toilets: 5, furnishing: 'unfurnished', condition: 'good',
    amenities: ['gated-estate', 'security', 'water', 'parking', 'bq', 'prepaid-meter'],
    fees: { agency: 10, legal: 5, caution: 500_000, service: 400_000 }, complete: true,
    verified: true, posted: 3, confirmed: 3, views: 610, saves: 35, agent: 'a6',
    images: ['house-7', 'living-10', 'kitchen-2', 'bed-2'],
    intro: 'A four-bedroom terraced duplex with a BQ in a small gated close off 6th Avenue.',
  },
  {
    id: 'FM-10439', title: '2 Bedroom Apartment', type: '2-bedroom', area: 'jabi', hood: 'Jabi Lake', street: 'Jabi Lake District',
    rent: 5_000_000, beds: 2, baths: 2, toilets: 3, furnishing: 'semi_furnished', condition: 'newly_built',
    amenities: ['water', 'prepaid-meter', 'generator', 'security', 'parking', 'ac', 'fitted-kitchen', 'elevator', 'balcony'],
    fees: { agency: 10, legal: 10, caution: 500_000, service: 700_000 }, complete: false,
    verified: true, posted: 1, confirmed: 1, views: 540, saves: 33, agent: 'a5',
    images: ['block-2', 'living-6', 'kitchen-1', 'bed-1'],
    intro: 'A new two-bedroom with a balcony facing the lake, fitted kitchen and air conditioning throughout.',
  },
  {
    id: 'FM-10440', title: '5 Bedroom Detached House', type: 'detached-house', area: 'maitama', hood: 'Maitama District', street: 'Off Mississippi Street',
    rent: 35_000_000, beds: 5, baths: 6, toilets: 7, sqm: 600, furnishing: 'unfurnished', condition: 'renovated',
    amenities: ['security', 'cctv', 'water', 'generator', 'parking', 'bq', 'pool', 'fitted-kitchen', 'wardrobes', 'ac'],
    fees: { agency: 10, legal: 10, caution: 3_000_000 }, complete: true,
    status: 'inspection_ongoing', verified: true, featured: true, posted: 12, confirmed: 2, views: 1980, saves: 142, agent: 'a5',
    images: ['house-3', 'living-15', 'kitchen-2', 'bed-1', 'house-9'],
    intro: 'A five-bedroom detached house with a pool and two-room BQ on a quiet street in Maitama. Suitable for a family or diplomatic residence.',
  },
  {
    id: 'FM-10441', title: '3 Bedroom Flat', type: '3-bedroom', area: 'old-gra', hood: 'Forces Avenue', street: 'Forces Avenue',
    rent: 4_500_000, beds: 3, baths: 3, toilets: 4, furnishing: 'unfurnished', condition: 'renovated',
    amenities: ['water', 'prepaid-meter', 'generator', 'security', 'parking'],
    fees: { agency: 10, legal: 10, caution: 400_000, service: 300_000 }, complete: true,
    verified: true, posted: 6, confirmed: 3, views: 400, saves: 21, agent: 'a7',
    images: ['block-4', 'living-2', 'kitchen-1', 'bed-2'],
    intro: 'A renovated three-bedroom flat in a managed block of six in Old GRA, with a shared generator and a resident caretaker.',
  },
  {
    id: 'FM-10442', title: '2 Bedroom Flat', type: '2-bedroom', area: 'gra-phase-2', hood: 'Tombia Street', street: 'Off Tombia Street',
    rent: 3_000_000, beds: 2, baths: 2, toilets: 3, furnishing: 'unfurnished', condition: 'good',
    amenities: ['water', 'prepaid-meter', 'security', 'parking'],
    fees: { agency: 10, legal: 10, caution: 300_000 }, complete: true,
    verified: false, posted: 10, updated: 8, confirmed: 8, views: 260, saves: 9, agent: 'a7',
    images: ['block-1', 'living-11', 'kitchen-2'],
    intro: 'A two-bedroom flat in a small compound off Tombia Street, close to the GRA Phase 2 shops.',
  },
  {
    id: 'FM-10443', title: '3 Bedroom Bungalow', type: 'detached-house', area: 'bodija', hood: 'New Bodija', street: 'New Bodija Estate',
    rent: 2_800_000, beds: 3, baths: 3, toilets: 4, furnishing: 'unfurnished', condition: 'good',
    amenities: ['water', 'prepaid-meter', 'security', 'parking', 'bq'],
    fees: { agency: 10, legal: 10, caution: 250_000 }, complete: true,
    verified: true, posted: 4, confirmed: 4, views: 300, saves: 17, agent: 'a8',
    images: ['house-2', 'living-3', 'kitchen-1', 'bed-2'],
    intro: 'A standalone three-bedroom bungalow with a BQ and a large compound in New Bodija, ten minutes from UI.',
  },
  {
    id: 'FM-10444', title: 'Mini Flat', type: 'mini-flat', area: 'jericho', hood: 'Jericho GRA', street: 'Jericho GRA',
    rent: 900_000, beds: 1, baths: 1, toilets: 1, furnishing: 'unfurnished', condition: 'renovated',
    amenities: ['water', 'prepaid-meter', 'security'],
    fees: { agency: 10, legal: 10, caution: 100_000 }, complete: true,
    verified: false, posted: 1, confirmed: 1, views: 150, saves: 6, agent: 'a8',
    images: ['block-3', 'living-11', 'kitchen-2'],
    intro: 'A renovated room and parlour in a quiet compound in Jericho GRA.',
  },
  {
    id: 'FM-10445', title: '2 Bedroom Apartment', type: '2-bedroom', area: 'lekki', hood: 'Agungi', street: 'Agungi, off Lekki–Epe Expressway',
    rent: 5_000_000, beds: 2, baths: 2, toilets: 3, furnishing: 'unfurnished', condition: 'newly_built',
    amenities: ['water', 'prepaid-meter', 'security', 'parking', 'pop-ceiling', 'fitted-kitchen'],
    fees: { agency: 10, legal: 10, caution: 500_000, service: 450_000 }, complete: true,
    verified: false, posted: 0, confirmed: 0, views: 190, saves: 14, agent: 'a4',
    images: ['block-2', 'living-13', 'kitchen-1', 'bed-1'],
    intro: 'A new two-bedroom apartment with a fitted kitchen in Agungi, first tenants.',
  },
  {
    id: 'FM-10446', title: '1 Bedroom Apartment', type: '1-bedroom', area: 'yaba', hood: 'Alagomeji', street: 'Off Herbert Macaulay Way',
    rent: 2_400_000, beds: 1, baths: 1, toilets: 2, furnishing: 'unfurnished', condition: 'newly_built',
    amenities: ['water', 'prepaid-meter', 'inverter', 'security', 'pop-ceiling', 'fitted-kitchen'],
    fees: { agency: 10, legal: 10, caution: 250_000, service: 200_000 }, complete: true,
    verified: true, posted: 1, confirmed: 1, views: 720, saves: 58, agent: 'a2',
    images: ['block-1', 'living-1', 'kitchen-2', 'bed-2'],
    intro: 'A new one-bedroom with a shared inverter system that keeps lights and sockets on during outages. Close to the Yaba tech cluster.',
  },
  {
    id: 'FM-10447', title: '3 Bedroom Semi-Detached Duplex', type: 'semi-detached-duplex', area: 'ajah', hood: 'Thomas Estate', street: 'Thomas Estate',
    rent: 7_000_000, beds: 3, baths: 4, toilets: 4, furnishing: 'unfurnished', condition: 'newly_built',
    amenities: ['gated-estate', 'security', 'water', 'prepaid-meter', 'parking', 'bq'],
    fees: { agency: 10, legal: 10, caution: 700_000, service: 500_000 }, complete: true,
    verified: true, posted: 3, confirmed: 3, views: 650, saves: 46, agent: 'a4',
    images: ['house-6', 'living-8', 'kitchen-1', 'bed-1'],
    intro: 'A new three-bedroom semi-detached duplex with a BQ inside Thomas Estate.',
  },
  {
    id: 'FM-10448', title: '4 Bedroom Serviced Penthouse', type: 'serviced-apartment', area: 'ikoyi', hood: 'Banana Island', street: 'Banana Island',
    rent: 85_000_000, beds: 4, baths: 5, toilets: 5, sqm: 380, furnishing: 'furnished', serviced: true, condition: 'newly_built',
    amenities: ['24h-power', 'water', 'security', 'cctv', 'elevator', 'pool', 'gym', 'ac', 'fitted-kitchen', 'wardrobes', 'water-heater', 'parking', 'bq', 'fibre', 'balcony'],
    fees: { agency: 10, legal: 10, caution: 5_000_000, service: 12_000_000 }, complete: true,
    verified: true, featured: true, posted: 8, confirmed: 2, views: 3120, saves: 240, agent: 'a9', video: true,
    images: ['house-11', 'living-15', 'kitchen-2', 'bed-1', 'living-12'],
    intro: 'A furnished four-bedroom penthouse with a wraparound terrace and lagoon views, in a serviced building with a pool, gym and 24-hour power.',
  },
  {
    id: 'FM-10449', title: '2 Bedroom Flat', type: '2-bedroom', area: 'ikeja', hood: 'Opebi', street: 'Opebi Road',
    rent: 4_200_000, beds: 2, baths: 2, toilets: 3, furnishing: 'unfurnished', condition: 'renovated',
    amenities: ['water', 'prepaid-meter', 'security', 'parking', 'generator'],
    fees: { agency: 10, legal: 10, caution: 400_000, service: 300_000 }, complete: true,
    status: 'rented', verified: true, posted: 20, confirmed: 3, views: 900, saves: 40, agent: 'a3',
    images: ['block-4', 'living-4', 'kitchen-1'],
    intro: 'A renovated two-bedroom flat off Opebi Road.',
  },
  {
    id: 'FM-10450', title: 'Mini Flat', type: 'mini-flat', area: 'gbagada', hood: 'Ifako', street: 'Ifako-Gbagada',
    rent: 1_700_000, beds: 1, baths: 1, toilets: 1, furnishing: 'unfurnished', condition: 'good',
    amenities: ['water', 'prepaid-meter', 'security'],
    fees: { agency: 10, legal: 10, caution: 150_000 }, complete: true,
    status: 'rented', verified: true, posted: 18, confirmed: 5, views: 610, saves: 25, agent: 'a2',
    images: ['block-3', 'living-2', 'kitchen-2'],
    intro: 'A room and parlour in Ifako-Gbagada.',
  },
  {
    id: 'FM-10451', title: '3 Bedroom Flat with BQ', type: '3-bedroom', area: 'lekki', hood: 'Jakande', street: 'Jakande Estate',
    rent: 6_000_000, beds: 3, baths: 3, toilets: 4, furnishing: 'unfurnished', condition: 'newly_built',
    amenities: ['gated-estate', 'security', 'water', 'prepaid-meter', 'parking', 'bq', 'pop-ceiling'],
    fees: { agency: 10, legal: 10, caution: 600_000, service: 600_000 }, complete: true,
    verified: true, posted: 2, confirmed: 1, views: 840, saves: 61, agent: 'a1',
    images: ['block-3', 'living-10', 'kitchen-1', 'bed-2'],
    intro: 'A new three-bedroom flat with a BQ in a gated estate in Jakande, Lekki.',
  },
  {
    id: 'FM-10452', title: 'Self-contain', type: 'self-contain', area: 'surulere', hood: 'Aguda', street: 'Aguda',
    rent: 750_000, beds: 1, baths: 1, toilets: 1, furnishing: 'unfurnished', condition: 'good',
    amenities: ['water', 'prepaid-meter'],
    fees: { agency: 10, legal: 10, caution: 75_000 }, complete: true,
    verified: false, posted: 30, updated: 16, confirmed: 16, views: 380, saves: 12, agent: 'a10',
    images: ['block-4', 'living-16'],
    intro: 'A self-contain in Aguda, Surulere.',
  },
  {
    id: 'FM-10453', title: '2 Bedroom Flat', type: '2-bedroom', area: 'maryland', hood: 'Anthony Village', street: 'Anthony Village',
    rent: 3_800_000, beds: 2, baths: 2, toilets: 3, furnishing: 'unfurnished', condition: 'renovated',
    amenities: ['water', 'prepaid-meter', 'security', 'parking', 'generator'],
    fees: { agency: 10, legal: 10, caution: 380_000, service: 250_000 }, complete: false,
    verified: false, posted: 3, confirmed: 3, views: 330, saves: 15, agent: 'a10',
    images: ['block-1', 'living-9', 'kitchen-2', 'bed-1'],
    intro: 'A renovated two-bedroom flat in Anthony Village, a short walk from the Ikorodu Road bus stop.',
  },
  {
    id: 'FM-10454', title: 'Room in Shared Apartment', type: 'shared-apartment', area: 'lekki', hood: 'Lekki Phase 1', street: 'Fola Osibo Road',
    rent: 180_000, period: 'month', upfront: 6, beds: 1, baths: 1, toilets: 1, furnishing: 'furnished', condition: 'renovated',
    amenities: ['24h-power', 'water', 'fibre', 'security', 'ac', 'parking'],
    fees: { agency: { flat: 90_000 }, caution: 180_000 }, complete: true,
    verified: true, posted: 1, confirmed: 1, views: 410, saves: 37, agent: 'a1',
    images: ['living-6', 'bed-2', 'kitchen-1'],
    intro: 'An en-suite furnished room in a managed three-bedroom co-living flat. Power, internet and weekly cleaning of shared areas are included in the rent.',
  },
  {
    id: 'FM-10455', title: '4 Bedroom Detached Duplex', type: 'detached-house', area: 'ikeja', hood: 'Ikeja GRA', street: 'Joel Ogunnaike Street',
    rent: 18_000_000, beds: 4, baths: 5, toilets: 6, sqm: 450, furnishing: 'unfurnished', condition: 'renovated',
    amenities: ['security', 'gated-estate', 'water', 'generator', 'parking', 'bq', 'fitted-kitchen', 'pop-ceiling', 'cctv'],
    fees: { agency: 10, legal: 10, caution: 1_500_000, service: 1_000_000 }, complete: true,
    verified: true, featured: true, posted: 6, confirmed: 2, views: 1290, saves: 93, agent: 'a3',
    images: ['house-8', 'living-15', 'kitchen-2', 'bed-1'],
    intro: 'A detached four-bedroom duplex on a large plot in Ikeja GRA, with a two-room BQ and space for five cars.',
  },
  {
    id: 'FM-10456', title: '1 Bedroom Apartment', type: '1-bedroom', area: 'gwarinpa', hood: '3rd Avenue', street: '3rd Avenue, Gwarinpa',
    rent: 2_500_000, beds: 1, baths: 1, toilets: 2, furnishing: 'unfurnished', condition: 'newly_built',
    amenities: ['water', 'prepaid-meter', 'security', 'parking'],
    fees: { agency: 10, legal: 10, caution: 250_000 }, complete: true,
    verified: false, posted: 2, confirmed: 2, views: 280, saves: 20, agent: 'a6',
    images: ['block-2', 'living-1', 'kitchen-2'],
    intro: 'A new one-bedroom apartment near 3rd Avenue, Gwarinpa.',
  },
]

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[’'()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function buildCharges(s: Seed): Charge[] {
  const yearlyRent = s.period === 'month' ? s.rent * 12 : s.rent
  const charges: Charge[] = []
  if (s.fees.agency !== undefined) {
    const amount = typeof s.fees.agency === 'number' ? Math.round((yearlyRent * s.fees.agency) / 100) : s.fees.agency.flat
    charges.push({
      type: 'agency_fee',
      label: typeof s.fees.agency === 'number' ? `Agency fee (${s.fees.agency}% of annual rent)` : 'Agency fee',
      amount,
      recurrence: 'one_time',
    })
  }
  if (s.fees.legal !== undefined) {
    charges.push({
      type: 'legal_fee',
      label: `Legal / agreement fee (${s.fees.legal}% of annual rent)`,
      amount: Math.round((yearlyRent * s.fees.legal) / 100),
      recurrence: 'one_time',
    })
  }
  if (s.fees.caution !== undefined) {
    charges.push({ type: 'caution_deposit', label: 'Caution deposit', amount: s.fees.caution, recurrence: 'one_time', refundable: true })
  }
  if (s.fees.service !== undefined) {
    charges.push({ type: 'service_charge', label: 'Service charge', amount: s.fees.service, recurrence: 'yearly' })
  }
  if (s.fees.other) charges.push(...s.fees.other)
  return charges
}

const furnishingText: Record<Furnishing, string> = {
  furnished: 'It comes fully furnished',
  semi_furnished: 'It is semi-furnished',
  unfurnished: 'It is let unfurnished',
}

function buildDescription(s: Seed): string[] {
  const area = findArea(s.area)
  const type = findType(s.type)
  const paras = [s.intro]
  const roomBits = `${s.beds} bedroom${s.beds > 1 ? 's' : ''}, ${s.baths} bathroom${s.baths > 1 ? 's' : ''} and ${s.toilets} toilet${s.toilets > 1 ? 's' : ''}`
  paras.push(
    `The ${type?.name.toLowerCase() ?? 'apartment'} has ${roomBits}${s.sqm ? `, across roughly ${s.sqm} square metres` : ''}. ${furnishingText[s.furnishing]}${s.serviced ? ' and is serviced, so building services are managed for you' : ''}.`,
  )
  if (area) {
    paras.push(`${s.hood} is in ${area.name}, ${area.cityName}. ${area.blurb}`)
  }
  paras.push(
    s.period === 'month'
      ? `Rent is paid monthly, with ${s.upfront} months required upfront. Inspection is by appointment with the agent.`
      : `Rent is paid yearly, with ${s.upfront ?? 1} year required upfront. Inspection is by appointment with the agent.`,
  )
  return paras
}

export const listings: Listing[] = seeds.map((s) => {
  const area = findArea(s.area)!
  return {
    id: s.id,
    slug: `${slugify(`${s.title} ${s.hood} ${area.name}`)}-${s.id.toLowerCase()}`,
    title: s.title,
    type: s.type,
    state: area.state,
    city: area.city,
    area: s.area,
    neighbourhood: s.hood,
    street: s.street,
    rent: s.rent,
    period: s.period ?? 'year',
    upfrontPeriods: s.upfront ?? 1,
    bedrooms: s.beds,
    bathrooms: s.baths,
    toilets: s.toilets,
    sizeSqm: s.sqm,
    furnishing: s.furnishing,
    serviced: s.serviced ?? false,
    condition: s.condition,
    amenities: s.amenities,
    charges: buildCharges(s),
    chargesComplete: s.complete,
    // Lead with an interior shot when the first photo is a generic block exterior
    images: (s.images[0]?.startsWith('block-') && s.images.length > 2 ? [...s.images.slice(1), s.images[0]] : s.images).map((i) => `/images/${i}`),
    hasVideoTour: s.video ?? false,
    status: s.status ?? 'available',
    verified: s.verified,
    featured: s.featured ?? false,
    postedDaysAgo: s.posted,
    updatedDaysAgo: s.updated ?? Math.min(s.posted, s.confirmed),
    confirmedDaysAgo: s.confirmed,
    views: s.views,
    saves: s.saves,
    agentId: s.agent,
    description: buildDescription(s),
  }
})

export function findListing(slug?: string) {
  return listings.find((l) => l.slug === slug)
}
