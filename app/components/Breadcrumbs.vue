<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

const props = defineProps<{ items: { label: string; to?: string | object }[] }>()

const config = useRequestURL()
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: props.items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.label,
          ...(typeof item.to === 'string' ? { item: `${config.origin}${item.to}` } : {}),
        })),
      }),
    },
  ],
})
</script>

<template>
  <nav aria-label="Breadcrumb" class="text-[13px] text-mist-500">
    <ol class="flex flex-wrap items-center gap-1">
      <li v-for="(item, i) in items" :key="i" class="inline-flex items-center gap-1">
        <NuxtLink v-if="item.to && i < items.length - 1" :to="item.to" class="hover:text-brand-700">{{ item.label }}</NuxtLink>
        <span v-else class="text-mist-700" :aria-current="i === items.length - 1 ? 'page' : undefined">{{ item.label }}</span>
        <ChevronRight v-if="i < items.length - 1" class="size-3.5 text-mist-400" />
      </li>
    </ol>
  </nav>
</template>
