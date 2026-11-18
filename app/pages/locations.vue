<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { states } from '~/data/locations'
import { listings } from '~/data/listings'

useSeoMeta({
  title: 'Browse apartments by location',
  description: 'Find apartments for rent by state, city, area and neighbourhood across Lagos, Abuja, Port Harcourt and Ibadan.',
})

const discoverable = listings.filter(isDiscoverable)
const countFor = (key: 'state' | 'city' | 'area', slug: string) => discoverable.filter((l) => l[key] === slug).length
const countHood = (area: string, hood: string) => discoverable.filter((l) => l.area === area && l.neighbourhood === hood).length
</script>

<template>
  <div>
    <section class="border-b border-mist-200 bg-mist-50">
      <div class="container-page py-10">
        <Breadcrumbs :items="[{ label: 'Home', to: '/' }, { label: 'Locations' }]" />
        <h1 class="mt-3 text-3xl font-extrabold">Browse by location</h1>
        <p class="mt-2 max-w-2xl text-[15px] text-mist-600">Go from state to city, area and neighbourhood. Counts show homes that are available right now.</p>
        <nav class="mt-5 flex flex-wrap gap-2" aria-label="Jump to state">
          <a v-for="s in states" :key="s.slug" :href="`#${s.slug}`" class="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-mist-700 ring-1 ring-inset ring-mist-200 hover:ring-brand-300">
            {{ s.name }} <span class="text-mist-400 tabular">{{ countFor('state', s.slug) }}</span>
          </a>
        </nav>
      </div>
    </section>

    <div class="container-page space-y-14 py-12">
      <section v-for="s in states" :id="s.slug" :key="s.slug" class="scroll-mt-24">
        <div v-for="c in s.cities" :key="c.slug">
          <div class="mb-5 flex flex-wrap items-end justify-between gap-2 border-b border-mist-200 pb-3">
            <div>
              <p class="eyebrow">{{ s.name }} State</p>
              <h2 class="mt-1 text-2xl font-extrabold">{{ c.name }}</h2>
            </div>
            <NuxtLink :to="searchLink({ state: s.slug, city: c.slug })" class="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
              All {{ countFor('city', c.slug) }} homes in {{ c.name }} <ArrowRight class="size-4" />
            </NuxtLink>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="a in c.areas" :key="a.slug" class="rounded-[var(--radius-card)] border border-mist-200 p-5">
              <div class="flex items-baseline justify-between gap-2">
                <NuxtLink :to="searchLink({ area: a.slug })" class="font-display text-lg font-extrabold text-mist-950 hover:text-brand-700">{{ a.name }}</NuxtLink>
                <span class="text-sm text-mist-500 tabular">{{ countFor('area', a.slug) }} available</span>
              </div>
              <p class="mt-1 text-sm text-mist-600">{{ a.blurb }}</p>
              <ul class="mt-3 flex flex-wrap gap-1.5">
                <li v-for="n in a.neighbourhoods" :key="n">
                  <NuxtLink
                    :to="searchLink({ area: a.slug, q: n })"
                    class="inline-block rounded-md bg-mist-100 px-2 py-1 text-xs font-medium text-mist-700 hover:bg-brand-50 hover:text-brand-800"
                  >
                    {{ n }}<span v-if="countHood(a.slug, n)" class="ml-1 text-mist-400">{{ countHood(a.slug, n) }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
