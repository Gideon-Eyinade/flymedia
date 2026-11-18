<script setup lang="ts">
import { LayoutGrid, List, SlidersHorizontal, X, Search, ChevronLeft, ChevronRight, BellRing } from 'lucide-vue-next'
import { sortOptions, type SortKey } from '~/composables/useListingSearch'
import { findArea, findCity, findState } from '~/data/locations'
import { findType } from '~/data/catalog'

const { filters, matched, results, totalPages, page, pageSize, chips, update, clearAll } = useListingSearch()
const { show } = useToast()

const drawerOpen = ref(false)
watch(drawerOpen, (open) => {
  if (import.meta.client) document.documentElement.style.overflow = open ? 'hidden' : ''
})
onBeforeUnmount(() => {
  if (import.meta.client) document.documentElement.style.overflow = ''
})

// Keyword box stays local until submitted
const keyword = ref(filters.value.q)
watch(() => filters.value.q, (q) => (keyword.value = q))

const placeName = computed(() => {
  const f = filters.value
  if (f.area) {
    const a = findArea(f.area)
    return a ? `${a.name}, ${a.cityName}` : ''
  }
  if (f.city) return findCity(f.city)?.name ?? ''
  if (f.state) return findState(f.state)?.name ?? ''
  return 'Nigeria'
})

const heading = computed(() => {
  const t = findType(filters.value.type)
  const what = t ? t.plural : 'Apartments'
  return `${what} for rent in ${placeName.value}`
})

useSeoMeta({
  title: () => heading.value,
  description: () =>
    `${matched.value.length} ${findType(filters.value.type)?.plural.toLowerCase() ?? 'apartments'} available for rent in ${placeName.value}. Compare rent, fees and amenities, and contact verified agents on Flymedia.`,
  ogTitle: () => `${heading.value} · Flymedia`,
})

function submitKeyword() {
  update((f) => (f.q = keyword.value.trim()))
}

function goToPage(p: number) {
  update((f) => (f.page = p), { resetPage: false })
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

const pageNumbers = computed(() => {
  const total = totalPages.value
  const cur = page.value
  const set = new Set([1, total, cur - 1, cur, cur + 1].filter((n) => n >= 1 && n <= total))
  return [...set].sort((a, b) => a - b)
})

const activeCount = computed(() => chips.value.filter((c) => c.key !== 'q').length)

function saveSearch() {
  show('Saved-search alerts will be available once accounts launch.')
}

const breadcrumbs = computed(() => {
  const items: { label: string; to?: string | object }[] = [{ label: 'Home', to: '/' }, { label: 'Apartments', to: '/apartments' }]
  const f = filters.value
  const state = findState(f.state)
  if (state) items.push({ label: state.name, to: searchLink({ state: state.slug }) })
  const area = findArea(f.area)
  if (area) items.push({ label: area.name })
  return items
})
</script>

<template>
  <div class="bg-mist-50">
    <!-- Page header -->
    <div class="border-b border-mist-200 bg-white">
      <div class="container-page py-6">
        <Breadcrumbs :items="breadcrumbs" />
        <div class="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 class="text-2xl font-extrabold sm:text-3xl">{{ heading }}</h1>
            <p class="mt-1 text-sm text-mist-600">
              <strong class="font-semibold text-mist-900 tabular">{{ matched.length }}</strong>
              {{ matched.length === 1 ? 'home' : 'homes' }} available or awaiting confirmation. Rented homes are never shown.
            </p>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" @click="saveSearch">
            <BellRing class="size-4" /> Alert me about new matches
          </button>
        </div>

        <form class="mt-5 grid gap-2 sm:grid-cols-[1fr_1fr_auto]" role="search" @submit.prevent="submitKeyword">
          <div class="relative">
            <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist-400" />
            <label for="search-keyword" class="sr-only">Keyword</label>
            <input id="search-keyword" v-model="keyword" type="search" class="field pl-9" placeholder="Keyword, e.g. BQ, Admiralty, estate" />
          </div>
          <div>
            <label for="search-location" class="sr-only">Location</label>
            <LocationInput
              id="search-location"
              :area="filters.area"
              placeholder="Area or neighbourhood"
              @select="(v) => update((f) => { f.area = v.area; if (!v.area) { f.city = ''; } if (v.keyword) { f.q = v.keyword } })"
            />
          </div>
          <button type="submit" class="btn btn-primary">Search</button>
        </form>
      </div>
    </div>

    <div class="container-page grid gap-8 py-6 lg:grid-cols-[280px_1fr]">
      <!-- Sidebar filters (desktop) -->
      <aside class="hidden lg:block" aria-label="Filters">
        <div class="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-[var(--radius-card)] border border-mist-200 bg-white p-5">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-bold">Filters</h2>
            <button v-if="activeCount" type="button" class="text-sm font-semibold text-brand-700 hover:text-brand-800" @click="clearAll">Clear all</button>
          </div>
          <SearchFilters :filters="filters" id-prefix="desk" @update="update" />
        </div>
      </aside>

      <section class="min-w-0" aria-label="Results">
        <!-- Toolbar -->
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="btn btn-secondary lg:hidden" @click="drawerOpen = true">
            <SlidersHorizontal class="size-4" /> Filters
            <span v-if="activeCount" class="grid size-5 place-items-center rounded-full bg-brand-700 text-[11px] text-white">{{ activeCount }}</span>
          </button>
          <p class="hidden text-sm text-mist-600 sm:block">
            Showing <strong class="font-semibold text-mist-900 tabular">{{ results.length ? (page - 1) * pageSize + 1 : 0 }}–{{ (page - 1) * pageSize + results.length }}</strong>
            of <strong class="font-semibold text-mist-900 tabular">{{ matched.length }}</strong>
          </p>
          <div class="ml-auto flex items-center gap-2">
            <label for="sort" class="sr-only">Sort by</label>
            <select
              id="sort"
              class="field h-10 w-auto min-w-48"
              :value="filters.sort"
              @change="update((f) => (f.sort = ($event.target as HTMLSelectElement).value as SortKey))"
            >
              <option v-for="o in sortOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
            <div class="hidden rounded-lg bg-white p-1 ring-1 ring-inset ring-mist-200 sm:flex" role="group" aria-label="Layout">
              <button
                type="button"
                class="grid size-8 place-items-center rounded-md"
                :class="filters.view === 'grid' ? 'bg-mist-100 text-mist-950' : 'text-mist-500 hover:text-mist-900'"
                :aria-pressed="filters.view === 'grid'"
                aria-label="Grid view"
                @click="update((f) => (f.view = 'grid'), { resetPage: false })"
              >
                <LayoutGrid class="size-4" />
              </button>
              <button
                type="button"
                class="grid size-8 place-items-center rounded-md"
                :class="filters.view === 'list' ? 'bg-mist-100 text-mist-950' : 'text-mist-500 hover:text-mist-900'"
                :aria-pressed="filters.view === 'list'"
                aria-label="List view"
                @click="update((f) => (f.view = 'list'), { resetPage: false })"
              >
                <List class="size-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Active filters -->
        <div v-if="chips.length" class="mt-4 flex flex-wrap items-center gap-2">
          <button
            v-for="c in chips"
            :key="c.key"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-full bg-brand-50 py-1 pl-3 pr-2 text-[13px] font-medium text-brand-800 ring-1 ring-inset ring-brand-200 hover:bg-brand-100"
            :aria-label="`Remove filter ${c.label}`"
            @click="update(c.clear)"
          >
            {{ c.label }} <X class="size-3.5" />
          </button>
          <button type="button" class="text-[13px] font-semibold text-mist-600 underline-offset-2 hover:text-mist-900 hover:underline" @click="clearAll">
            Clear all
          </button>
        </div>

        <!-- Results -->
        <div v-if="results.length" class="mt-5 grid gap-5" :class="filters.view === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'">
          <ListingCard v-for="l in results" :key="l.id" :listing="l" :variant="filters.view" />
        </div>
        <div v-else class="mt-5">
          <EmptyState
            title="No apartments match these filters"
            body="Try a wider budget, fewer amenities or a nearby area. You can also tell us what you need and we’ll pass it to agents."
          >
            <button type="button" class="btn btn-secondary" @click="clearAll">Clear filters</button>
            <NuxtLink to="/request" class="btn btn-primary">Request an apartment</NuxtLink>
          </EmptyState>
        </div>

        <!-- Pagination -->
        <nav v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
          <button type="button" class="btn btn-secondary btn-sm" :disabled="page <= 1" @click="goToPage(page - 1)">
            <ChevronLeft class="size-4" /> Previous
          </button>
          <template v-for="(n, i) in pageNumbers" :key="n">
            <span v-if="i > 0 && n - pageNumbers[i - 1]! > 1" class="px-1 text-mist-400">…</span>
            <button
              type="button"
              class="grid size-9 place-items-center rounded-lg text-sm font-semibold tabular"
              :class="n === page ? 'bg-mist-950 text-white' : 'text-mist-700 hover:bg-white hover:ring-1 hover:ring-mist-200'"
              :aria-current="n === page ? 'page' : undefined"
              @click="goToPage(n)"
            >
              {{ n }}
            </button>
          </template>
          <button type="button" class="btn btn-secondary btn-sm" :disabled="page >= totalPages" @click="goToPage(page + 1)">
            Next <ChevronRight class="size-4" />
          </button>
        </nav>
      </section>
    </div>

    <!-- Mobile filter drawer -->
    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-150" leave-to-class="opacity-0">
        <div v-if="drawerOpen" class="fixed inset-0 z-50 bg-mist-950/40 lg:hidden" @click="drawerOpen = false" />
      </Transition>
      <Transition enter-active-class="transition-transform duration-250 ease-out" enter-from-class="translate-y-full" leave-active-class="transition-transform duration-200 ease-in" leave-to-class="translate-y-full">
        <div
          v-if="drawerOpen"
          class="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-2xl bg-white lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          <div class="flex items-center justify-between border-b border-mist-200 px-4 py-3">
            <h2 class="text-base font-bold">Filters</h2>
            <button type="button" class="btn btn-ghost size-10 p-0" aria-label="Close filters" @click="drawerOpen = false"><X class="size-5" /></button>
          </div>
          <div class="flex-1 overflow-y-auto px-4 py-4">
            <SearchFilters :filters="filters" id-prefix="mob" @update="update" />
          </div>
          <div class="grid grid-cols-[auto_1fr] gap-2 border-t border-mist-200 p-4">
            <button type="button" class="btn btn-secondary" @click="clearAll">Clear all</button>
            <button type="button" class="btn btn-primary" @click="drawerOpen = false">
              Show {{ matched.length }} {{ matched.length === 1 ? 'home' : 'homes' }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
