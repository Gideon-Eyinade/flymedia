import { SAVED_STORAGE_KEY } from '~/composables/useSaved'

// Restore saved homes after hydration so server and client markup match.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const saved = useState<string[]>('saved-listings', () => [])
    try {
      const raw = localStorage.getItem(SAVED_STORAGE_KEY)
      if (raw) saved.value = JSON.parse(raw)
    } catch {
      /* storage unavailable — keep in memory only */
    }
  })
})
