export interface Toast {
  id: number
  message: string
  tone: 'default' | 'success' | 'error'
}

export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])

  function show(message: string, tone: Toast['tone'] = 'default', duration = 3200) {
    const id = Date.now() + Math.random()
    toasts.value = [...toasts.value, { id, message, tone }]
    if (import.meta.client) {
      setTimeout(() => dismiss(id), duration)
    }
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, show, dismiss }
}
