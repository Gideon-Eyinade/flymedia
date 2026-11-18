<script setup lang="ts">
import { ShieldCheck, Receipt, BadgeCheck, Search, CalendarCheck, KeyRound, ArrowRight, Check, MessageSquareText } from 'lucide-vue-next'
import { listings } from '~/data/listings'
import { agents } from '~/data/agents'
import { popularAreaSlugs, findArea, states } from '~/data/locations'
import { propertyTypes, quickSearchTypes, findType } from '~/data/catalog'

useSeoMeta({
  title: 'Find available apartments for rent in Nigeria',
  titleTemplate: 'Flymedia · %s',
  description:
    'Discover apartments that are genuinely available for rent in Lagos, Abuja, Port Harcourt and Ibadan. See the full move-in cost, compare options and contact verified agents.',
  ogTitle: 'Flymedia · Find available apartments for rent in Nigeria',
  ogDescription: 'Verified listings, availability confirmed weekly and full move-in costs upfront.',
  ogImage: '/images/house-10.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const discoverable = listings.filter(isDiscoverable)

const popularAreas = popularAreaSlugs.map((slug) => {
  const area = findArea(slug)!
  const inArea = discoverable.filter((l) => l.area === slug && l.period === 'year')
  const minRent = inArea.length ? Math.min(...inArea.map((l) => l.rent)) : null
  return { area, count: discoverable.filter((l) => l.area === slug).length, minRent }
})

// Recently added — with a city tab filter
const cityTabs = [{ slug: '', name: 'All cities' }, ...states.flatMap((s) => s.cities.map((c) => ({ slug: c.slug, name: c.name })))]
const recentCity = ref('')
const recent = computed(() =>
  [...discoverable]
    .filter((l) => !recentCity.value || l.city === recentCity.value)
    .sort((a, b) => a.postedDaysAgo - b.postedDaysAgo || b.views - a.views)
    .slice(0, 8),
)

const featured = discoverable.filter((l) => l.featured).sort((a, b) => b.views - a.views)

const typeCounts = propertyTypes.map((t) => ({ ...t, count: discoverable.filter((l) => l.type === t.slug).length }))

const trustedAgents = [...agents].sort((a, b) => Number(b.verified) - Number(a.verified) || b.rating - a.rating)

const confirmedThisWeek = discoverable.filter((l) => l.confirmedDaysAgo <= 7).length

const steps = [
  { icon: Search, title: 'Search available homes', body: 'Filter by area, budget, bedrooms and the things that matter in Nigeria: water, power, security and parking.' },
  { icon: Receipt, title: 'See the full cost', body: 'Rent, agency fee, legal fee, caution deposit and service charge, listed separately so you know what you’ll pay upfront.' },
  { icon: CalendarCheck, title: 'Book an inspection', body: 'Message the agent on WhatsApp or request an inspection time. Availability is re-confirmed every week.' },
  { icon: KeyRound, title: 'Move in', body: 'Agree terms with the agent, sign your tenancy agreement and collect your keys.' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative isolate overflow-hidden bg-brand-950">
      <img
        src="/images/house-10.jpg"
        alt="Modern apartment building with balconies and a pool"
        class="absolute inset-0 -z-10 size-full object-cover"
        fetchpriority="high"
      />
      <div class="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(4_33_29/0.88)_0%,rgb(4_33_29/0.62)_55%,rgb(4_33_29/0.25)_100%)]" />
      <div class="container-page pb-12 pt-14 sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-24">
        <div class="max-w-2xl">
          <p class="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/20">
            <span class="size-1.5 rounded-full bg-emerald-400" />
            {{ confirmedThisWeek }} apartments confirmed available this week
          </p>
          <h1 class="text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-[3.4rem]">
            Find a place you’ll love to call home.
          </h1>
          <p class="mt-4 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
            Discover available apartments across your preferred locations. Explore verified listings, compare rental
            options and connect with property agents.
          </p>
        </div>

        <div class="mt-8 max-w-5xl">
          <HeroSearch />
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <span class="text-sm text-white/70">Popular:</span>
            <NuxtLink
              v-for="slug in quickSearchTypes"
              :key="slug"
              :to="searchLink({ type: slug })"
              class="rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/20"
            >
              {{ findType(slug)?.plural }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust strip -->
    <section class="border-b border-mist-200 bg-white">
      <div class="container-page grid gap-4 py-5 sm:grid-cols-3">
        <div class="flex items-center gap-3">
          <span class="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><ShieldCheck class="size-5" /></span>
          <p class="text-sm leading-5"><strong class="block font-semibold text-mist-950">Availability confirmed weekly</strong><span class="text-mist-600">Unconfirmed listings are flagged, then hidden.</span></p>
        </div>
        <div class="flex items-center gap-3">
          <span class="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700"><Receipt class="size-5" /></span>
          <p class="text-sm leading-5"><strong class="block font-semibold text-mist-950">Every fee shown upfront</strong><span class="text-mist-600">Agency, legal, caution and service charge.</span></p>
        </div>
        <div class="flex items-center gap-3">
          <span class="grid size-10 shrink-0 place-items-center rounded-lg bg-sun-50 text-sun-700"><BadgeCheck class="size-5" /></span>
          <p class="text-sm leading-5"><strong class="block font-semibold text-mist-950">Verified agents and homes</strong><span class="text-mist-600">Checked by the Flymedia team.</span></p>
        </div>
      </div>
    </section>

    <!-- Popular locations -->
    <section class="container-page py-14 sm:py-16">
      <SectionHeading
        title="Popular locations"
        subtitle="Start with an area, then narrow down by neighbourhood, budget and bedrooms."
        link-to="/locations"
        link-label="Browse all locations"
      />
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <NuxtLink
          v-for="{ area, count, minRent } in popularAreas"
          :key="area.slug"
          :to="searchLink({ area: area.slug })"
          class="group flex flex-col rounded-[var(--radius-card)] border border-mist-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-[var(--shadow-lift)]"
        >
          <span class="text-[11px] font-medium uppercase tracking-wider text-mist-500">{{ area.cityName === area.stateName ? area.stateName : `${area.cityName}, ${area.stateName}` }}</span>
          <span class="mt-1 font-display text-lg font-extrabold text-mist-950 group-hover:text-brand-700">{{ area.name }}</span>
          <span class="mt-0.5 line-clamp-1 text-xs text-mist-500">{{ area.neighbourhoods.slice(0, 3).join(' · ') }}</span>
          <span class="mt-4 flex items-end justify-between gap-2 text-sm">
            <span class="text-mist-700"><strong class="font-semibold text-mist-950 tabular">{{ count }}</strong> available</span>
            <span v-if="minRent" class="text-xs text-mist-500">from <strong class="font-semibold text-mist-800">{{ formatNairaCompact(minRent) }}</strong>/yr</span>
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- Recently added -->
    <section class="bg-mist-50 py-14 sm:py-16">
      <div class="container-page">
        <SectionHeading
          eyebrow="Fresh on Flymedia"
          title="Recently added apartments"
          subtitle="New listings from agents, each showing when availability was last confirmed."
          :link-to="searchLink({ sort: 'newest', city: recentCity })"
          link-label="See all new listings"
        />
        <div class="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter by city">
          <button
            v-for="c in cityTabs"
            :key="c.slug"
            type="button"
            role="tab"
            :aria-selected="recentCity === c.slug"
            class="shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors"
            :class="recentCity === c.slug ? 'bg-mist-950 text-white' : 'bg-white text-mist-700 ring-1 ring-inset ring-mist-200 hover:ring-mist-300'"
            @click="recentCity = c.slug"
          >
            {{ c.name }}
          </button>
        </div>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ListingCard v-for="l in recent" :key="l.id" :listing="l" />
        </div>
      </div>
    </section>

    <!-- Promotions -->
    <section class="container-page pt-14 sm:pt-16">
      <div class="grid gap-4 md:grid-cols-2">
        <NuxtLink
          :to="searchLink({ type: 'serviced-apartment' })"
          class="group relative isolate flex min-h-56 flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-6 sm:p-8"
        >
          <img src="/images/living-14.jpg" alt="" class="absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div class="absolute inset-0 -z-10 bg-mist-950/55" />
          <span class="mb-2 w-fit rounded-full bg-sun-400 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-mist-950">Serviced living</span>
          <h3 class="max-w-sm text-2xl font-extrabold text-white">24-hour power, managed for you</h3>
          <p class="mt-1 max-w-sm text-sm text-white/80">Serviced apartments in Ikoyi, VI and Lekki with the service charge itemised.</p>
          <span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white">Explore serviced apartments <ArrowRight class="size-4" /></span>
        </NuxtLink>
        <NuxtLink
          :to="searchLink({ max: '2500000' })"
          class="group relative isolate flex min-h-56 flex-col justify-end overflow-hidden rounded-[var(--radius-card)] bg-brand-800 p-6 sm:p-8"
        >
          <img src="/images/living-11.jpg" alt="" class="absolute inset-y-0 right-0 -z-10 h-full w-1/2 object-cover opacity-90 [mask-image:linear-gradient(to_right,transparent,black_45%)]" loading="lazy" />
          <span class="mb-2 w-fit rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">Under ₦2.5M a year</span>
          <h3 class="max-w-xs text-2xl font-extrabold text-white">First place? Start here.</h3>
          <p class="mt-1 max-w-xs text-sm text-white/80">Self-contains, mini flats and shared apartments for students and young professionals.</p>
          <span class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white">See affordable homes <ArrowRight class="size-4" /></span>
        </NuxtLink>
      </div>
    </section>

    <!-- Featured -->
    <section class="container-page py-14 sm:py-16">
      <SectionHeading
        title="Featured apartments"
        subtitle="Premium homes promoted by agents. Promotion never changes how availability is shown."
        :link-to="searchLink({ sort: 'popular' })"
        link-label="View popular homes"
      />
      <HScroller v-slot="{ itemClass }" label="Featured apartments">
        <div v-for="l in featured" :key="l.id" :class="itemClass">
          <ListingCard :listing="l" :show-featured="true" class="h-full" />
        </div>
      </HScroller>
    </section>

    <!-- Property types -->
    <section class="bg-mist-50 py-14 sm:py-16">
      <div class="container-page">
        <SectionHeading title="Browse by property type" subtitle="From a first self-contain to a family duplex." link-to="/property-types" link-label="All property types" />
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <NuxtLink
            v-for="t in typeCounts"
            :key="t.slug"
            :to="searchLink({ type: t.slug })"
            class="group overflow-hidden rounded-[var(--radius-card)] border border-mist-200 bg-white transition hover:shadow-[var(--shadow-lift)]"
          >
            <div class="aspect-[16/10] overflow-hidden bg-mist-100">
              <img :src="t.image" :alt="t.plural" class="size-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            </div>
            <div class="p-3">
              <p class="text-sm font-semibold leading-snug text-mist-950 group-hover:text-brand-700">{{ t.plural }}</p>
              <p class="mt-0.5 text-xs text-mist-500 tabular">{{ plural(t.count, 'listing') }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Agents -->
    <section class="container-page py-14 sm:py-16">
      <SectionHeading
        title="Find trusted agents"
        subtitle="Agents and property managers who keep their listings current. Verified agents have passed Flymedia’s identity and business checks."
        link-to="/agents"
        link-label="All agents"
      />
      <HScroller v-slot="{ itemClass }" label="Trusted agents">
        <div v-for="a in trustedAgents" :key="a.id" :class="itemClass">
          <AgentCard :agent="a" />
        </div>
      </HScroller>
    </section>

    <!-- How it works -->
    <section id="how-it-works" class="scroll-mt-20 border-y border-mist-200 bg-white py-14 sm:py-16">
      <div class="container-page">
        <SectionHeading title="How Flymedia works" subtitle="From search to keys in four steps." />
        <ol class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="(s, i) in steps" :key="s.title" class="relative">
            <div class="flex items-center gap-3">
              <span class="grid size-11 place-items-center rounded-xl bg-brand-700 text-white"><component :is="s.icon" class="size-5" /></span>
              <span class="font-display text-sm font-bold text-mist-400">Step {{ i + 1 }}</span>
            </div>
            <h3 class="mt-4 text-base font-bold">{{ s.title }}</h3>
            <p class="mt-1.5 text-sm leading-6 text-mist-600">{{ s.body }}</p>
          </li>
        </ol>
        <div class="mt-10 flex flex-col items-start justify-between gap-4 rounded-[var(--radius-card)] bg-mist-50 p-5 sm:flex-row sm:items-center">
          <div class="flex items-start gap-3">
            <MessageSquareText class="mt-0.5 size-5 shrink-0 text-brand-700" />
            <p class="text-sm leading-6 text-mist-700">
              <strong class="font-semibold text-mist-950">Can’t find what you need?</strong>
              Tell us your budget and preferred areas and we’ll share your request with agents who cover them.
            </p>
          </div>
          <NuxtLink to="/request" class="btn btn-secondary shrink-0">Request an apartment</NuxtLink>
        </div>
      </div>
    </section>

    <!-- List your property -->
    <section class="container-page py-14 sm:py-16">
      <div class="grid overflow-hidden rounded-2xl bg-mist-950 lg:grid-cols-2">
        <div class="p-8 sm:p-12">
          <p class="eyebrow text-brand-300">For agents and landlords</p>
          <h2 class="mt-3 text-3xl font-extrabold text-white">List your property where serious tenants are looking</h2>
          <p class="mt-3 max-w-md text-[15px] leading-7 text-mist-300">
            Publish apartments in minutes, confirm availability with one click, and manage enquiries and inspection
            requests from your phone.
          </p>
          <ul class="mt-6 space-y-2.5 text-sm text-mist-200">
            <li v-for="item in ['Free to list your first properties', 'Enquiries straight to your WhatsApp', 'Get a verified badge on your profile', 'See views, saves and enquiries for every listing']" :key="item" class="flex items-center gap-2">
              <Check class="size-4 text-brand-300" /> {{ item }}
            </li>
          </ul>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/list-property" class="btn btn-sun">List a property</NuxtLink>
            <NuxtLink to="/signup?role=agent" class="btn bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/15">Create an agent account</NuxtLink>
          </div>
        </div>
        <div class="relative min-h-64">
          <img src="/images/house-7.jpg" alt="Row of new terraced duplexes" class="absolute inset-0 size-full object-cover" loading="lazy" />
        </div>
      </div>
    </section>
  </div>
</template>
