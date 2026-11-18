export type AvailabilityStatus =
  | 'available'
  | 'awaiting_confirmation'
  | 'inspection_ongoing'
  | 'rented'
  | 'unavailable'
  | 'archived'

export type Furnishing = 'furnished' | 'semi_furnished' | 'unfurnished'
export type BuildingCondition = 'newly_built' | 'renovated' | 'good' | 'fair'
export type RentPeriod = 'year' | 'month'

export type ChargeType = 'agency_fee' | 'legal_fee' | 'caution_deposit' | 'service_charge' | 'other'
export type ChargeRecurrence = 'one_time' | 'yearly' | 'monthly'

export interface Charge {
  type: ChargeType
  label: string
  amount: number
  recurrence: ChargeRecurrence
  refundable?: boolean
}

export interface Listing {
  id: string
  slug: string
  title: string
  type: string // property type slug
  state: string // state slug
  city: string // city slug
  area: string // area slug
  neighbourhood?: string
  street?: string
  rent: number // in naira, per `period`
  period: RentPeriod
  /** How many periods must be paid upfront (e.g. 1 year, or 6 months) */
  upfrontPeriods: number
  bedrooms: number
  bathrooms: number
  toilets: number
  sizeSqm?: number
  furnishing: Furnishing
  serviced: boolean
  condition: BuildingCondition
  amenities: string[]
  charges: Charge[]
  /** Agent has declared these are ALL the charges a tenant will pay upfront */
  chargesComplete: boolean
  images: string[]
  hasVideoTour?: boolean
  status: AvailabilityStatus
  /** Flymedia staff have inspected the property — separate from availability confirmation */
  verified: boolean
  featured: boolean
  postedDaysAgo: number
  updatedDaysAgo: number
  confirmedDaysAgo: number
  views: number
  saves: number
  agentId: string
  description: string[]
}

export interface AgentReview {
  author: string
  rating: number
  date: string
  body: string
}

export interface Agent {
  id: string
  slug: string
  name: string
  agency?: string
  kind: 'agency' | 'independent' | 'property_manager'
  verified: boolean
  areas: string[] // area slugs
  phone: string
  whatsapp: string
  email: string
  bio: string
  yearsActive: number
  joined: string
  rating: number
  reviewCount: number
  responseTime: string
  rentedCount: number
  monogramColor: string
  reviews: AgentReview[]
}

export interface PropertyType {
  slug: string
  name: string
  plural: string
  short: string
  description: string
  image: string
}

export interface Area {
  slug: string
  name: string
  neighbourhoods: string[]
  blurb: string
}

export interface City {
  slug: string
  name: string
  areas: Area[]
}

export interface State {
  slug: string
  name: string
  cities: City[]
}

export interface Amenity {
  id: string
  name: string
  group: 'utilities' | 'security' | 'comfort' | 'building'
}
