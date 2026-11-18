/**
 * Platform settings. In production these will be configurable from the admin
 * dashboard; for the static website they live here.
 */
export const platformSettings = {
  /** Days after the last confirmation before a listing needs re-confirming */
  confirmationIntervalDays: 7,
  /** Days a listing may sit in "Awaiting confirmation" before it is hidden from search */
  confirmationGraceDays: 7,
  /** Results per page on the search page */
  pageSize: 12,
  supportPhone: '+234 800 000 0100',
  supportEmail: 'hello@flymedia.ng',
  supportWhatsApp: '2348000000100',
  officeAddress: '14B Admiralty Way, Lekki Phase 1, Lagos',
}
