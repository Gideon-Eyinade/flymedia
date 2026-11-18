<script setup lang="ts">
import { ShieldCheck, Receipt, BadgeCheck, Users } from 'lucide-vue-next'
import { listings } from '~/data/listings'
import { agents } from '~/data/agents'
import { allAreas } from '~/data/locations'
import { platformSettings } from '~/data/settings'

useSeoMeta({
  title: 'About us',
  description: 'Flymedia is an apartment discovery and rental marketplace for Nigeria, built around listing freshness, transparent fees and verified agents.',
})

const stats = [
  { value: listings.filter(isDiscoverable).length, label: 'available homes right now' },
  { value: agents.filter((a) => a.verified).length, label: 'verified agents' },
  { value: allAreas.length, label: 'areas covered' },
  { value: `${platformSettings.confirmationIntervalDays} days`, label: 'maximum time between availability checks' },
]

const principles = [
  { icon: ShieldCheck, title: 'Available means available', body: `Agents re-confirm every listing at least every ${platformSettings.confirmationIntervalDays} days. If they don’t, the listing is flagged, then hidden. Rented homes are never shown as available.` },
  { icon: Receipt, title: 'No surprise fees', body: 'Agency fee, legal fee, caution deposit and service charge are listed separately. If an agent hasn’t confirmed every charge, we don’t show a total.' },
  { icon: BadgeCheck, title: 'Verification is earned', body: 'A verified agent has passed identity and business checks. A verified home has been inspected by our team. Confirming availability doesn’t make a listing “verified”.' },
  { icon: Users, title: 'Agents are partners', body: 'We give agents simple tools to keep listings fresh and respond quickly, because tenants trust agents who do.' },
]
</script>

<template>
  <div>
    <PageHeader
      crumb="About us"
      eyebrow="About Flymedia"
      title="Apartment hunting in Nigeria shouldn’t mean chasing homes that are already gone."
      intro="Flymedia connects people looking for a home with agents, property managers and landlords who have apartments available right now, and shows the full cost before you inspect."
    />

    <section class="container-page py-14">
      <dl class="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-mist-200 bg-mist-200 lg:grid-cols-4">
        <div v-for="s in stats" :key="s.label" class="bg-white p-6">
          <dd class="font-display text-3xl font-extrabold text-mist-950 tabular">{{ s.value }}</dd>
          <dt class="mt-1 text-sm text-mist-600">{{ s.label }}</dt>
        </div>
      </dl>
    </section>

    <section class="container-page grid gap-12 pb-14 lg:grid-cols-[1fr_1.2fr] lg:items-start">
      <div class="prose-flymedia">
        <h2 class="!mt-0 text-2xl">Why we built Flymedia</h2>
        <p>
          Anyone who has searched for an apartment in Lagos or Abuja knows the routine: you find a place online, call
          the agent, and hear it was rented weeks ago. Or you inspect, like it, and discover the fees add up to far more
          than the rent you were quoted.
        </p>
        <p>
          Flymedia is built to fix both. Every listing carries a “last confirmed” date, and the platform automatically
          flags and hides listings that agents stop confirming. Every fee is itemised so you can compare the real cost of
          moving in.
        </p>
        <p>
          We start with apartments for rent in Lagos, Abuja, Port Harcourt and Ibadan, and we’ll add cities as agents
          there join.
        </p>
      </div>
      <img src="/images/block-3.jpg" alt="Modern apartment block against a blue sky" class="aspect-[4/3] w-full rounded-[var(--radius-card)] object-cover" loading="lazy" />
    </section>

    <section class="border-t border-mist-200 bg-mist-50 py-14">
      <div class="container-page">
        <SectionHeading title="What we stand for" />
        <div class="grid gap-5 sm:grid-cols-2">
          <div v-for="p in principles" :key="p.title" class="rounded-[var(--radius-card)] border border-mist-200 bg-white p-6">
            <span class="grid size-10 place-items-center rounded-lg bg-brand-50 text-brand-700"><component :is="p.icon" class="size-5" /></span>
            <h3 class="mt-4 text-lg font-bold">{{ p.title }}</h3>
            <p class="mt-1.5 text-sm leading-6 text-mist-600">{{ p.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container-page flex flex-col items-start justify-between gap-4 py-14 sm:flex-row sm:items-center">
      <div>
        <h2 class="text-2xl font-extrabold">Ready to find your next home?</h2>
        <p class="mt-1 text-mist-600">Search available apartments or list a property today.</p>
      </div>
      <div class="flex gap-2">
        <NuxtLink to="/apartments" class="btn btn-primary">Find apartments</NuxtLink>
        <NuxtLink to="/list-property" class="btn btn-secondary">List a property</NuxtLink>
      </div>
    </section>
  </div>
</template>
