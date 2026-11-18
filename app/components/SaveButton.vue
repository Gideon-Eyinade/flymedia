<script setup lang="ts">
import { Heart } from 'lucide-vue-next'

const props = withDefaults(defineProps<{ listingId: string; variant?: 'overlay' | 'button' }>(), { variant: 'overlay' })
const { isSaved, toggle } = useSaved()
const active = computed(() => isSaved(props.listingId))
</script>

<template>
  <button
    v-if="variant === 'overlay'"
    type="button"
    class="grid size-9 place-items-center rounded-full bg-white/95 text-mist-700 shadow-sm transition hover:scale-105 hover:text-rose-600"
    :aria-pressed="active"
    :aria-label="active ? 'Remove from saved homes' : 'Save this home'"
    @click.prevent.stop="toggle(listingId)"
  >
    <Heart class="size-[18px]" :class="active && 'fill-rose-500 text-rose-500'" />
  </button>
  <button
    v-else
    type="button"
    class="btn btn-secondary"
    :aria-pressed="active"
    @click="toggle(listingId)"
  >
    <Heart class="size-4" :class="active && 'fill-rose-500 text-rose-500'" />
    {{ active ? 'Saved' : 'Save' }}
  </button>
</template>
