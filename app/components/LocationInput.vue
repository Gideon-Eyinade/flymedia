<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import { findArea } from '~/data/locations'

/**
 * Location typeahead. Emits the chosen area slug and, when a neighbourhood
 * was picked, the neighbourhood name as an extra keyword.
 */
const props = defineProps<{ area: string; keyword?: string; inputClass?: string; id: string; placeholder?: string }>()
const emit = defineEmits<{ select: [{ area: string; keyword: string }] }>()

const text = ref(props.keyword || findArea(props.area)?.name || '')
const open = ref(false)
const active = ref(0)

watch(
  () => [props.area, props.keyword],
  () => {
    text.value = props.keyword || findArea(props.area)?.name || ''
  },
)

const suggestions = computed(() => locationSuggestions(text.value))

function choose(s: { label: string; area: string }) {
  const area = findArea(s.area)
  text.value = s.label
  open.value = false
  emit('select', { area: s.area, keyword: area && area.name !== s.label ? s.label : '' })
}

function onInput() {
  open.value = true
  active.value = 0
  if (!text.value.trim()) emit('select', { area: '', keyword: '' })
}

function onKeydown(e: KeyboardEvent) {
  if (!open.value || !suggestions.value.length) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    active.value = (active.value + 1) % suggestions.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    active.value = (active.value - 1 + suggestions.value.length) % suggestions.value.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    choose(suggestions.value[active.value]!)
  } else if (e.key === 'Escape') {
    open.value = false
  }
}

function onBlur() {
  setTimeout(() => {
    open.value = false
    // Free text that matches an area exactly still counts as a selection
    const exact = suggestions.value.find((s) => s.label.toLowerCase() === text.value.trim().toLowerCase())
    if (exact && exact.area !== props.area) choose(exact)
  }, 150)
}
</script>

<template>
  <div class="relative">
    <MapPin class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist-400" />
    <input
      :id="id"
      v-model="text"
      type="text"
      autocomplete="off"
      role="combobox"
      :aria-expanded="open && suggestions.length > 0"
      :aria-controls="`${id}-list`"
      :placeholder="placeholder ?? 'Area or neighbourhood, e.g. Lekki'"
      class="field pl-9"
      :class="inputClass"
      @input="onInput"
      @focus="open = true"
      @blur="onBlur"
      @keydown="onKeydown"
    />
    <ul
      v-if="open && suggestions.length"
      :id="`${id}-list`"
      role="listbox"
      class="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-auto rounded-lg border border-mist-200 bg-white py-1 shadow-[var(--shadow-lift)]"
    >
      <li
        v-for="(s, i) in suggestions"
        :key="`${s.area}-${s.label}`"
        role="option"
        :aria-selected="i === active"
        class="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm"
        :class="i === active ? 'bg-brand-50' : 'hover:bg-mist-50'"
        @mousedown.prevent="choose(s)"
        @mouseenter="active = i"
      >
        <MapPin class="size-3.5 shrink-0 text-mist-400" />
        <span class="font-medium text-mist-900">{{ s.label }}</span>
        <span class="truncate text-mist-500">{{ s.sub }}</span>
      </li>
    </ul>
  </div>
</template>
