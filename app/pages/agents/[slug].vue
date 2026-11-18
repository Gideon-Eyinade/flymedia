<script setup lang="ts">
import { Phone, MessageCircle, Mail, MapPin, Star, Clock3, CalendarDays, KeyRound, Copy } from 'lucide-vue-next'
import { findAgent } from '~/data/agents'
import { listings } from '~/data/listings'
import { findArea } from '~/data/locations'

const route = useRoute()
const agent = findAgent(String(route.params.slug))
if (!agent) throw createError({ statusCode: 404, statusMessage: 'This agent could not be found', fatal: true })

const { show } = useToast()
const kindLabel = { agency: 'Real estate agency', independent: 'Independent agent', property_manager: 'Property manager' }[agent.kind]

const own = listings.filter((l) => l.agentId === agent.id)
const active = own.filter(isDiscoverable)
const rented = own.filter((l) => effectiveStatus(l) === 'rented')
const areas = agent.areas.map((a) => findArea(a)!).filter(Boolean)

const tab = ref<'active' | 'rented' | 'reviews'>('active')

useSeoMeta({
  title: `${agent.name}, ${kindLabel.toLowerCase()} in ${areas.map((a) => a.name).slice(0, 3).join(', ')}`,
  description: `${agent.name} has ${active.length} available apartments on Flymedia. ${agent.bio.slice(0, 120)}`,
})

const waLink = `https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(`Hello ${agent.name}, I found you on Flymedia and I’m looking for an apartment.`)}`

async function copy(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text)
    show(`${label} copied`)
  } catch {
    show(text)
  }
}
</script>

<template>
  <div>
    <!-- Cover -->
    <div class="relative h-36 overflow-hidden sm:h-44" :style="{ backgroundColor: agent.monogramColor }">
      <img src="/images/block-2.jpg" alt="" class="size-full object-cover opacity-25 mix-blend-luminosity" />
    </div>

    <div class="container-page">
      <div class="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end">
        <div class="rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-mist-200 w-fit">
          <AgentAvatar :agent="agent" size="xl" />
        </div>
        <div class="min-w-0 flex-1 pb-1">
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-2xl font-extrabold sm:text-3xl">{{ agent.name }}</h1>
            <VerifiedBadge v-if="agent.verified" label="Verified agent" />
            <span v-else class="rounded-full bg-mist-100 px-2 py-0.5 text-xs font-medium text-mist-600">Verification pending</span>
          </div>
          <p class="mt-1 text-mist-600">
            {{ kindLabel }}<template v-if="agent.agency && agent.agency !== 'Independent agent'"> · {{ agent.agency }}</template>
          </p>
        </div>
        <div class="flex flex-wrap gap-2 pb-1">
          <a :href="`tel:${agent.phone.replace(/\s/g, '')}`" class="btn btn-secondary"><Phone class="size-4" /> Call</a>
          <a :href="waLink" target="_blank" rel="noopener" class="btn btn-whatsapp"><MessageCircle class="size-4" /> WhatsApp</a>
        </div>
      </div>

      <div class="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div class="min-w-0">
          <section>
            <h2 class="text-lg font-bold">About</h2>
            <p class="mt-2 max-w-[68ch] leading-7 text-mist-700">{{ agent.bio }}</p>
          </section>

          <dl class="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-mist-200 bg-mist-200 sm:grid-cols-4">
            <div class="bg-white p-4">
              <dt class="text-xs text-mist-500">Available now</dt>
              <dd class="mt-1 font-display text-2xl font-extrabold text-mist-950 tabular">{{ active.length }}</dd>
            </div>
            <div class="bg-white p-4">
              <dt class="text-xs text-mist-500">Homes rented</dt>
              <dd class="mt-1 font-display text-2xl font-extrabold text-mist-950 tabular">{{ agent.rentedCount }}</dd>
            </div>
            <div class="bg-white p-4">
              <dt class="text-xs text-mist-500">Rating</dt>
              <dd class="mt-1 flex items-center gap-1 font-display text-2xl font-extrabold text-mist-950">
                {{ agent.rating.toFixed(1) }} <Star class="size-4 fill-sun-400 text-sun-400" />
              </dd>
            </div>
            <div class="bg-white p-4">
              <dt class="text-xs text-mist-500">Years active</dt>
              <dd class="mt-1 font-display text-2xl font-extrabold text-mist-950 tabular">{{ agent.yearsActive }}</dd>
            </div>
          </dl>

          <div class="mt-10 flex gap-1 border-b border-mist-200" role="tablist">
            <button
              v-for="t in [
                { v: 'active', l: `Available (${active.length})` },
                { v: 'rented', l: `Recently rented (${rented.length})` },
                { v: 'reviews', l: `Reviews (${agent.reviewCount})` },
              ] as const"
              :key="t.v"
              type="button"
              role="tab"
              :aria-selected="tab === t.v"
              class="-mb-px border-b-2 px-3 py-3 text-sm font-semibold transition-colors"
              :class="tab === t.v ? 'border-brand-700 text-brand-800' : 'border-transparent text-mist-600 hover:text-mist-900'"
              @click="tab = t.v"
            >
              {{ t.l }}
            </button>
          </div>

          <div class="py-6">
            <template v-if="tab === 'active'">
              <div v-if="active.length" class="grid gap-5 sm:grid-cols-2">
                <ListingCard v-for="l in active" :key="l.id" :listing="l" />
              </div>
              <EmptyState v-else title="No available homes right now" body="This agent has no listings that are currently available." />
            </template>
            <template v-else-if="tab === 'rented'">
              <div v-if="rented.length" class="grid gap-5 sm:grid-cols-2">
                <ListingCard v-for="l in rented" :key="l.id" :listing="l" :show-featured="false" />
              </div>
              <EmptyState v-else title="No recently rented homes to show" body="Homes this agent lets through Flymedia will appear here." />
            </template>
            <template v-else>
              <div class="mb-6 flex items-center gap-3">
                <span class="font-display text-4xl font-extrabold text-mist-950">{{ agent.rating.toFixed(1) }}</span>
                <div>
                  <div class="flex gap-0.5">
                    <Star v-for="i in 5" :key="i" class="size-4" :class="i <= Math.round(agent.rating) ? 'fill-sun-400 text-sun-400' : 'text-mist-300'" />
                  </div>
                  <p class="text-sm text-mist-600">Based on {{ agent.reviewCount }} reviews from tenants</p>
                </div>
              </div>
              <ul class="divide-y divide-mist-200 rounded-[var(--radius-card)] border border-mist-200">
                <li v-for="r in agent.reviews" :key="r.author + r.date" class="p-5">
                  <div class="flex items-center justify-between gap-2">
                    <p class="font-semibold text-mist-950">{{ r.author }}</p>
                    <p class="text-xs text-mist-500">{{ r.date }}</p>
                  </div>
                  <div class="mt-1 flex gap-0.5">
                    <Star v-for="i in 5" :key="i" class="size-3.5" :class="i <= r.rating ? 'fill-sun-400 text-sun-400' : 'text-mist-300'" />
                  </div>
                  <p class="mt-2 text-sm leading-6 text-mist-700">{{ r.body }}</p>
                </li>
              </ul>
            </template>
          </div>
        </div>

        <aside class="space-y-4">
          <div class="rounded-[var(--radius-card)] border border-mist-200 p-5">
            <h2 class="text-base font-bold">Contact</h2>
            <ul class="mt-4 space-y-3 text-sm">
              <li class="flex items-center gap-3">
                <Phone class="size-4 text-mist-400" />
                <a :href="`tel:${agent.phone.replace(/\s/g, '')}`" class="font-medium text-mist-900 hover:text-brand-700">{{ agent.phone }}</a>
                <button type="button" class="ml-auto text-mist-400 hover:text-mist-700" aria-label="Copy phone number" @click="copy(agent.phone, 'Phone number')"><Copy class="size-4" /></button>
              </li>
              <li class="flex items-center gap-3">
                <Mail class="size-4 text-mist-400" />
                <a :href="`mailto:${agent.email}`" class="truncate font-medium text-mist-900 hover:text-brand-700">{{ agent.email }}</a>
                <button type="button" class="ml-auto text-mist-400 hover:text-mist-700" aria-label="Copy email" @click="copy(agent.email, 'Email')"><Copy class="size-4" /></button>
              </li>
              <li class="flex items-center gap-3 text-mist-700"><Clock3 class="size-4 text-mist-400" /> {{ agent.responseTime }}</li>
              <li class="flex items-center gap-3 text-mist-700"><CalendarDays class="size-4 text-mist-400" /> On Flymedia since {{ agent.joined }}</li>
              <li class="flex items-center gap-3 text-mist-700"><KeyRound class="size-4 text-mist-400" /> {{ agent.rentedCount }} homes rented</li>
            </ul>
          </div>
          <div class="rounded-[var(--radius-card)] border border-mist-200 p-5">
            <h2 class="text-base font-bold">Areas served</h2>
            <div class="mt-3 flex flex-wrap gap-2">
              <NuxtLink
                v-for="a in areas"
                :key="a.slug"
                :to="searchLink({ area: a.slug })"
                class="inline-flex items-center gap-1 rounded-full border border-mist-200 px-3 py-1.5 text-sm text-mist-700 hover:border-brand-300 hover:text-brand-700"
              >
                <MapPin class="size-3.5" /> {{ a.name }}
              </NuxtLink>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
