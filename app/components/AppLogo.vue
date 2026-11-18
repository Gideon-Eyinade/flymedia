<script setup lang="ts">
withDefaults(defineProps<{ inverted?: boolean }>(), { inverted: false })
</script>

<template>
  <span class="inline-flex items-center gap-2">
    <svg viewBox="0 0 32 32" class="size-8 shrink-0" aria-hidden="true">
      <rect width="32" height="32" rx="8" :fill="inverted ? '#ffffff' : '#0c5f52'" />
      <path d="M7.5 15.6 16 8.8l8.5 6.8V24h-5.8v-5.2h-5.4V24H7.5z" :fill="inverted ? '#0c5f52' : '#ffffff'" />
      <circle cx="24" cy="8.6" r="2.6" fill="#f4b23f" />
    </svg>
    <span
      class="font-display text-[1.35rem] font-extrabold leading-none tracking-[-0.03em]"
      :class="inverted ? 'text-white' : 'text-mist-950'"
    >flymedia</span>
  </span>
</template>
