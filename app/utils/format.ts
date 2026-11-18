import type { RentPeriod } from '~/types'

const naira = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 })

export function formatNaira(amount: number) {
  return `₦${naira.format(amount)}`
}

/** ₦4.5M, ₦850k — for tight spaces such as chips and dropdowns */
export function formatNairaCompact(amount: number) {
  if (amount >= 1_000_000) {
    const m = amount / 1_000_000
    return `₦${m % 1 === 0 ? m : m.toFixed(1).replace(/\.0$/, '')}M`
  }
  if (amount >= 1_000) return `₦${Math.round(amount / 1_000)}k`
  return `₦${amount}`
}

export function periodLabel(period: RentPeriod) {
  return period === 'year' ? 'year' : 'month'
}

export function daysAgoText(days: number) {
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 14) return '1 week ago'
  if (days < 31) return `${Math.floor(days / 7)} weeks ago`
  const months = Math.floor(days / 30)
  return months <= 1 ? '1 month ago' : `${months} months ago`
}

/** Calendar date for "n days ago" — rendered on the client relative to today */
export function dateFromDaysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function plural(n: number, word: string, pluralWord = `${word}s`) {
  return `${n} ${n === 1 ? word : pluralWord}`
}

export function compactNumber(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : `${n}`
}
