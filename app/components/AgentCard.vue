<script setup lang="ts">
import { MapPin, Star } from 'lucide-vue-next'
import type { Agent } from '~/types'
import { findArea } from '~/data/locations'
import { listings } from '~/data/listings'

const props = defineProps<{ agent: Agent }>()
const activeCount = computed(() => listings.filter((l) => l.agentId === props.agent.id && isDiscoverable(l)).length)
const areas = computed(() => props.agent.areas.map((a) => findArea(a)?.name).filter(Boolean).join(', '))
const kindLabel = { agency: 'Agency', independent: 'Independent agent', property_manager: 'Property manager' }
</script>

<template>
  <article class="relative flex h-full flex-col rounded-[var(--radius-card)] border border-mist-200 bg-white p-5 transition-shadow hover:shadow-[var(--shadow-lift)]">
    <div class="flex items-start gap-3">
      <AgentAvatar :agent="agent" />
      <div class="min-w-0">
        <h3 class="truncate text-[15px] font-bold text-mist-950">
          <NuxtLink :to="`/agents/${agent.slug}`" class="after:absolute after:inset-0 hover:text-brand-700">{{ agent.name }}</NuxtLink>
        </h3>
        <p class="truncate text-xs text-mist-500">{{ agent.kind === 'independent' && agent.agency !== 'Independent agent' ? agent.agency : kindLabel[agent.kind] }}</p>
        <div class="mt-1.5">
          <VerifiedBadge v-if="agent.verified" label="Verified agent" />
          <span v-else class="text-xs font-medium text-mist-500">Verification pending</span>
        </div>
      </div>
    </div>
    <p class="mt-4 flex items-start gap-1.5 text-sm text-mist-600">
      <MapPin class="mt-0.5 size-3.5 shrink-0 text-mist-400" />
      <span class="line-clamp-2">{{ areas }}</span>
    </p>
    <div class="mt-auto flex items-center justify-between border-t border-mist-100 pt-3 text-sm">
      <span class="text-mist-700"><strong class="font-semibold text-mist-950 tabular">{{ activeCount }}</strong> active {{ activeCount === 1 ? 'listing' : 'listings' }}</span>
      <span class="inline-flex items-center gap-1 text-mist-700">
        <Star class="size-3.5 fill-sun-400 text-sun-400" />
        <strong class="font-semibold text-mist-950">{{ agent.rating.toFixed(1) }}</strong>
        <span class="text-mist-500">({{ agent.reviewCount }})</span>
      </span>
    </div>
    <span class="mt-3 text-sm font-semibold text-brand-700">View profile →</span>
  </article>
</template>
