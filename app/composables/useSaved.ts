export const SAVED_STORAGE_KEY = 'flymedia:saved'

/**
 * Saved apartments. In this static build they are kept in the browser's
 * localStorage; once accounts exist they will sync to the user's profile.
 */
export function useSaved() {
  const saved = useState<string[]>('saved-listings', () => [])

  function persist() {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(saved.value))
    } catch {
      /* ignore */
    }
  }

  const { show } = useToast()

  function isSaved(id: string) {
    return saved.value.includes(id)
  }

  function toggle(id: string) {
    if (isSaved(id)) {
      saved.value = saved.value.filter((x) => x !== id)
      show('Removed from saved homes')
    } else {
      saved.value = [...saved.value, id]
      show('Saved. Find it any time under Saved homes.')
    }
    persist()
  }

  return { saved, isSaved, toggle }
}
