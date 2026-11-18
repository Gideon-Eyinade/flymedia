<script setup lang="ts">
import { BadgeCheck } from 'lucide-vue-next'

withDefaults(defineProps<{ label?: string; tone?: 'solid' | 'plain' }>(), {
  label: 'Verified',
  tone: 'plain',
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1 text-xs font-semibold"
    :class="tone === 'solid' ? 'rounded-full bg-white/95 px-2 py-0.5 text-brand-800 shadow-sm' : 'text-brand-700'"
  >
    <BadgeCheck class="size-3.5" />
    {{ label }}
  </span>
</template>
