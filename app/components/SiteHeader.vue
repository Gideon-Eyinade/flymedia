<script setup lang="ts">
import { ChevronDown, Heart, Menu, X, Search, MapPin, ArrowRight, Plus } from 'lucide-vue-next'
import { states } from '~/data/locations'
import { propertyTypes } from '~/data/catalog'

const route = useRoute()
const { saved } = useSaved()

type MenuKey = 'locations' | 'types' | null
const openMenu = ref<MenuKey>(null)
const mobileOpen = ref(false)
const mobileSection = ref<MenuKey>(null)
let closeTimer: ReturnType<typeof setTimeout> | undefined

function enter(key: MenuKey) {
  clearTimeout(closeTimer)
  openMenu.value = key
}
function leave() {
  closeTimer = setTimeout(() => (openMenu.value = null), 120)
}
function toggle(key: MenuKey) {
  openMenu.value = openMenu.value === key ? null : key
}

watch(
  () => route.fullPath,
  () => {
    openMenu.value = null
    mobileOpen.value = false
  },
)

watch(mobileOpen, (open) => {
  if (import.meta.client) document.documentElement.style.overflow = open ? 'hidden' : ''
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    openMenu.value = null
    mobileOpen.value = false
  }
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

const navLink = 'inline-flex h-16 shrink-0 items-center gap-1 whitespace-nowrap px-2.5 xl:px-3 text-sm font-medium text-mist-700 transition-colors hover:text-brand-700'
const isActive = (path: string) => route.path === path || route.path.startsWith(`${path}/`)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-mist-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
    <div class="container-page flex h-16 items-center gap-4">
      <NuxtLink to="/" class="shrink-0" aria-label="Flymedia home">
        <AppLogo />
      </NuxtLink>

      <!-- Desktop navigation -->
      <nav class="ml-2 hidden items-center lg:flex xl:ml-4" aria-label="Main">
        <NuxtLink to="/apartments" :class="[navLink, isActive('/apartments') && 'text-brand-700']">Find Apartments</NuxtLink>

        <div class="relative" @mouseenter="enter('locations')" @mouseleave="leave">
          <button
            type="button"
            :class="[navLink, (openMenu === 'locations' || isActive('/locations')) && 'text-brand-700']"
            :aria-expanded="openMenu === 'locations'"
            aria-haspopup="true"
            @click="toggle('locations')"
          >
            Browse Locations
            <ChevronDown class="size-4 transition-transform" :class="openMenu === 'locations' && 'rotate-180'" />
          </button>
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            leave-active-class="transition duration-100 ease-in"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="openMenu === 'locations'"
              class="absolute left-1/2 top-full w-[760px] -translate-x-1/3 rounded-b-xl border border-t-0 border-mist-200 bg-white p-6 shadow-[var(--shadow-lift)]"
            >
              <div class="grid grid-cols-4 gap-6">
                <div v-for="s in states" :key="s.slug">
                  <NuxtLink
                    :to="searchLink({ state: s.slug })"
                    class="mb-2 block text-xs font-semibold uppercase tracking-wider text-mist-500 hover:text-brand-700"
                  >
                    {{ s.name }}
                  </NuxtLink>
                  <ul class="space-y-1">
                    <li v-for="a in s.cities.flatMap((c) => c.areas)" :key="a.slug">
                      <NuxtLink
                        :to="searchLink({ area: a.slug })"
                        class="block rounded-md py-1 text-sm text-mist-800 hover:text-brand-700"
                      >
                        {{ a.name }}
                      </NuxtLink>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="mt-5 flex items-center justify-between border-t border-mist-100 pt-4">
                <p class="text-sm text-mist-500">Search by state, city, area or neighbourhood.</p>
                <NuxtLink to="/locations" class="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800">
                  All locations <ArrowRight class="size-4" />
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>

        <div class="relative" @mouseenter="enter('types')" @mouseleave="leave">
          <button
            type="button"
            :class="[navLink, (openMenu === 'types' || isActive('/property-types')) && 'text-brand-700']"
            :aria-expanded="openMenu === 'types'"
            aria-haspopup="true"
            @click="toggle('types')"
          >
            Property Types
            <ChevronDown class="size-4 transition-transform" :class="openMenu === 'types' && 'rotate-180'" />
          </button>
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            leave-active-class="transition duration-100 ease-in"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="openMenu === 'types'"
              class="absolute left-0 top-full w-[560px] rounded-b-xl border border-t-0 border-mist-200 bg-white p-3 shadow-[var(--shadow-lift)]"
            >
              <div class="grid grid-cols-2 gap-1">
                <NuxtLink
                  v-for="t in propertyTypes"
                  :key="t.slug"
                  :to="searchLink({ type: t.slug })"
                  class="flex items-center gap-3 rounded-lg p-2 hover:bg-mist-50"
                >
                  <img :src="t.image" alt="" class="size-11 shrink-0 rounded-md object-cover" loading="lazy" />
                  <span class="min-w-0">
                    <span class="block text-sm font-semibold text-mist-900">{{ t.plural }}</span>
                    <span class="block truncate text-xs text-mist-500">{{ t.description }}</span>
                  </span>
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>

        <NuxtLink to="/agents" :class="[navLink, isActive('/agents') && 'text-brand-700']">Find an Agent</NuxtLink>
        <NuxtLink to="/about" :class="[navLink, isActive('/about') && 'text-brand-700']">About Us</NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-1 sm:gap-2">
        <NuxtLink to="/apartments" class="btn btn-ghost size-10 p-0 lg:hidden" aria-label="Search apartments">
          <Search class="size-5" />
        </NuxtLink>
        <NuxtLink to="/saved" class="btn btn-ghost relative size-10 p-0" aria-label="Saved homes">
          <Heart class="size-5" />
          <ClientOnly>
            <span
              v-if="saved.length"
              class="tabular absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-700 px-1 text-[10px] font-bold text-white"
            >{{ saved.length }}</span>
          </ClientOnly>
        </NuxtLink>
        <NuxtLink to="/login" class="btn btn-ghost hidden xl:inline-flex">Log in</NuxtLink>
        <NuxtLink to="/signup" class="btn btn-secondary hidden lg:inline-flex">Sign up</NuxtLink>
        <NuxtLink to="/list-property" class="btn btn-primary hidden sm:inline-flex">
          <Plus class="size-4" /> List a Property
        </NuxtLink>
        <button
          type="button"
          class="btn btn-ghost size-10 p-0 lg:hidden"
          aria-label="Open menu"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = true"
        >
          <Menu class="size-5" />
        </button>
      </div>
    </div>

    <!-- Mobile drawer -->
    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-150" leave-to-class="opacity-0">
        <div v-if="mobileOpen" class="fixed inset-0 z-50 bg-mist-950/40 lg:hidden" @click="mobileOpen = false" />
      </Transition>
      <Transition enter-active-class="transition-transform duration-250 ease-out" enter-from-class="translate-x-full" leave-active-class="transition-transform duration-200 ease-in" leave-to-class="translate-x-full">
        <aside
          v-if="mobileOpen"
          class="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-xl lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div class="flex h-16 items-center justify-between border-b border-mist-200 px-4">
            <AppLogo />
            <button type="button" class="btn btn-ghost size-10 p-0" aria-label="Close menu" @click="mobileOpen = false">
              <X class="size-5" />
            </button>
          </div>
          <nav class="flex-1 overflow-y-auto px-2 py-3" aria-label="Mobile">
            <NuxtLink to="/apartments" class="flex h-12 items-center rounded-lg px-3 font-medium text-mist-900 hover:bg-mist-50">Find Apartments</NuxtLink>

            <button
              type="button"
              class="flex h-12 w-full items-center justify-between rounded-lg px-3 font-medium text-mist-900 hover:bg-mist-50"
              :aria-expanded="mobileSection === 'locations'"
              @click="mobileSection = mobileSection === 'locations' ? null : 'locations'"
            >
              Browse Locations
              <ChevronDown class="size-4 transition-transform" :class="mobileSection === 'locations' && 'rotate-180'" />
            </button>
            <div v-if="mobileSection === 'locations'" class="mb-2 space-y-3 px-3 pb-2">
              <div v-for="s in states" :key="s.slug">
                <p class="mb-1 text-xs font-semibold uppercase tracking-wider text-mist-500">{{ s.name }}</p>
                <div class="flex flex-wrap gap-1.5">
                  <NuxtLink
                    v-for="a in s.cities.flatMap((c) => c.areas)"
                    :key="a.slug"
                    :to="searchLink({ area: a.slug })"
                    class="rounded-full border border-mist-200 px-3 py-1.5 text-sm text-mist-700"
                  >{{ a.name }}</NuxtLink>
                </div>
              </div>
              <NuxtLink to="/locations" class="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                <MapPin class="size-4" /> All locations
              </NuxtLink>
            </div>

            <button
              type="button"
              class="flex h-12 w-full items-center justify-between rounded-lg px-3 font-medium text-mist-900 hover:bg-mist-50"
              :aria-expanded="mobileSection === 'types'"
              @click="mobileSection = mobileSection === 'types' ? null : 'types'"
            >
              Property Types
              <ChevronDown class="size-4 transition-transform" :class="mobileSection === 'types' && 'rotate-180'" />
            </button>
            <div v-if="mobileSection === 'types'" class="mb-2 grid grid-cols-2 gap-1 px-1 pb-2">
              <NuxtLink
                v-for="t in propertyTypes"
                :key="t.slug"
                :to="searchLink({ type: t.slug })"
                class="rounded-lg px-2 py-2 text-sm text-mist-700 hover:bg-mist-50"
              >{{ t.plural }}</NuxtLink>
            </div>

            <NuxtLink to="/agents" class="flex h-12 items-center rounded-lg px-3 font-medium text-mist-900 hover:bg-mist-50">Find an Agent</NuxtLink>
            <NuxtLink to="/request" class="flex h-12 items-center rounded-lg px-3 font-medium text-mist-900 hover:bg-mist-50">Request an Apartment</NuxtLink>
            <NuxtLink to="/saved" class="flex h-12 items-center rounded-lg px-3 font-medium text-mist-900 hover:bg-mist-50">Saved Homes</NuxtLink>
            <NuxtLink to="/about" class="flex h-12 items-center rounded-lg px-3 font-medium text-mist-900 hover:bg-mist-50">About Us</NuxtLink>
            <NuxtLink to="/faq" class="flex h-12 items-center rounded-lg px-3 font-medium text-mist-900 hover:bg-mist-50">FAQs</NuxtLink>
          </nav>
          <div class="grid gap-2 border-t border-mist-200 p-4">
            <NuxtLink to="/list-property" class="btn btn-primary w-full"><Plus class="size-4" /> List a Property</NuxtLink>
            <div class="grid grid-cols-2 gap-2">
              <NuxtLink to="/login" class="btn btn-secondary">Log in</NuxtLink>
              <NuxtLink to="/signup" class="btn btn-secondary">Sign up</NuxtLink>
            </div>
          </div>
        </aside>
      </Transition>
    </Teleport>
  </header>
</template>
