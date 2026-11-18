<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

defineProps<{ title: string; subtitle?: string; eyebrow?: string; linkTo?: string | object; linkLabel?: string }>()
</script>

<template>
  <div class="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
    <div class="max-w-2xl">
      <p v-if="eyebrow" class="eyebrow mb-2">{{ eyebrow }}</p>
      <h2 class="text-2xl font-extrabold sm:text-[1.75rem]">{{ title }}</h2>
      <p v-if="subtitle" class="mt-1.5 text-[15px] text-mist-600">{{ subtitle }}</p>
    </div>
    <slot name="actions">
      <NuxtLink
        v-if="linkTo"
        :to="linkTo"
        class="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        {{ linkLabel ?? 'View all' }} <ArrowRight class="size-4" />
      </NuxtLink>
    </slot>
  </div>
</template>
