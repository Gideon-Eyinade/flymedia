<script setup lang="ts">
import { SearchX } from 'lucide-vue-next'

defineProps<{ title: string; body?: string }>()
</script>

<template>
  <div class="rounded-[var(--radius-card)] border border-dashed border-mist-300 bg-mist-50 px-6 py-14 text-center">
    <div class="mx-auto grid size-12 place-items-center rounded-full bg-white text-mist-500 ring-1 ring-mist-200">
      <slot name="icon"><SearchX class="size-5" /></slot>
    </div>
    <h3 class="mt-4 text-lg font-bold">{{ title }}</h3>
    <p v-if="body" class="mx-auto mt-1.5 max-w-md text-sm leading-6 text-mist-600">{{ body }}</p>
    <div class="mt-5 flex flex-wrap justify-center gap-2">
      <slot />
    </div>
  </div>
</template>
