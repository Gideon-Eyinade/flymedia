import type { AvailabilityStatus, Listing } from '~/types'
import { platformSettings } from '~/data/settings'

/**
 * The status a visitor sees. Agents set the stored status; the confirmation
 * clock can only downgrade it:
 *  - "available" past the confirmation interval  → "awaiting_confirmation"
 *  - past the interval + grace period            → "unavailable" (hidden)
 * Rented, unavailable and archived listings are never shown as available.
 */
export function effectiveStatus(listing: Listing): AvailabilityStatus {
  const { confirmationIntervalDays, confirmationGraceDays } = platformSettings
  if (listing.status === 'rented' || listing.status === 'unavailable' || listing.status === 'archived') {
    return listing.status
  }
  if (listing.confirmedDaysAgo > confirmationIntervalDays + confirmationGraceDays) return 'unavailable'
  if (listing.status === 'available' && listing.confirmedDaysAgo > confirmationIntervalDays) {
    return 'awaiting_confirmation'
  }
  return listing.status
}

/** Shown in public search and on the homepage */
export function isDiscoverable(listing: Listing) {
  const s = effectiveStatus(listing)
  return s === 'available' || s === 'awaiting_confirmation' || s === 'inspection_ongoing'
}

export function daysUntilConfirmationDue(listing: Listing) {
  return platformSettings.confirmationIntervalDays - listing.confirmedDaysAgo
}

export interface StatusMeta {
  label: string
  short: string
  description: string
  /** tailwind classes for the badge */
  badge: string
  dot: string
}

export const statusMeta: Record<AvailabilityStatus, StatusMeta> = {
  available: {
    label: 'Available',
    short: 'Available',
    description: 'The agent has confirmed this home is available to rent.',
    badge: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
    dot: 'bg-emerald-500',
  },
  awaiting_confirmation: {
    label: 'Awaiting confirmation',
    short: 'Awaiting confirmation',
    description: 'The agent has not re-confirmed availability recently. Ask before you plan an inspection.',
    badge: 'bg-amber-50 text-amber-800 ring-amber-600/25',
    dot: 'bg-amber-500',
  },
  inspection_ongoing: {
    label: 'Inspection ongoing',
    short: 'Inspection ongoing',
    description: 'Other prospective tenants are inspecting. It may be taken soon.',
    badge: 'bg-sky-50 text-sky-800 ring-sky-600/20',
    dot: 'bg-sky-500',
  },
  rented: {
    label: 'Rented',
    short: 'Rented',
    description: 'This home has been let and is no longer available.',
    badge: 'bg-mist-100 text-mist-700 ring-mist-400/30',
    dot: 'bg-mist-500',
  },
  unavailable: {
    label: 'Unavailable',
    short: 'Unavailable',
    description: 'This listing is hidden until the agent confirms it again.',
    badge: 'bg-rose-50 text-rose-800 ring-rose-600/20',
    dot: 'bg-rose-500',
  },
  archived: {
    label: 'Expired',
    short: 'Expired',
    description: 'This listing has expired.',
    badge: 'bg-mist-100 text-mist-600 ring-mist-400/30',
    dot: 'bg-mist-400',
  },
}

/** Upfront cost to move in — only when the agent has declared all charges. */
export function moveInCost(listing: Listing) {
  const rentUpfront = listing.rent * listing.upfrontPeriods
  const oneTime = listing.charges.filter((c) => c.recurrence === 'one_time').reduce((s, c) => s + c.amount, 0)
  const firstRecurring = listing.charges
    .filter((c) => c.recurrence !== 'one_time')
    .reduce((s, c) => s + c.amount, 0)
  return {
    rentUpfront,
    oneTime,
    firstRecurring,
    total: listing.chargesComplete ? rentUpfront + oneTime + firstRecurring : null,
  }
}
