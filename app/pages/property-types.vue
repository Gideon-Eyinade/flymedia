<script setup lang="ts">
import { propertyTypes } from '~/data/catalog'
import { listings } from '~/data/listings'

useSeoMeta({
  title: 'Apartment and property types',
  description: 'Self-contains, mini flats, 1–3 bedroom apartments, duplexes, shared and serviced apartments. Learn what each means and browse available homes.',
})

const discoverable = listings.filter(isDiscoverable)
const types = propertyTypes.map((t) => {
  const inType = discoverable.filter((l) => l.type === t.slug)
  const yearly = inType.filter((l) => l.period === 'year').map((l) => l.rent)
  return { ...t, count: inType.length, from: yearly.length ? Math.min(...yearly) : null }
})
</script>

<template>
  <div>
    <section class="border-b border-mist-200 bg-mist-50">
      <div class="container-page py-10">
        <Breadcrumbs :items="[{ label: 'Home', to: '/' }, { label: 'Property types' }]" />
        <h1 class="mt-3 text-3xl font-extrabold">Property types</h1>
        <p class="mt-2 max-w-2xl text-[15px] text-mist-600">Not sure what a mini flat is, or how a terrace differs from a semi-detached duplex? Here’s what each type means.</p>
      </div>
    </section>
    <div class="container-page grid gap-5 py-12 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="t in types"
        :key="t.slug"
        :to="searchLink({ type: t.slug })"
        class="group overflow-hidden rounded-[var(--radius-card)] border border-mist-200 bg-white transition hover:shadow-[var(--shadow-lift)]"
      >
        <div class="aspect-[16/9] overflow-hidden bg-mist-100">
          <img :src="t.image" :alt="t.plural" class="size-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        </div>
        <div class="p-5">
          <h2 class="text-lg font-bold group-hover:text-brand-700">{{ t.plural }}</h2>
          <p class="mt-1 text-sm leading-6 text-mist-600">{{ t.description }}</p>
          <p class="mt-4 flex items-center justify-between border-t border-mist-100 pt-3 text-sm">
            <span class="text-mist-700"><strong class="font-semibold text-mist-950 tabular">{{ t.count }}</strong> available</span>
            <span v-if="t.from" class="text-mist-500">from <strong class="font-semibold text-mist-800">{{ formatNairaCompact(t.from) }}</strong>/yr</span>
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
