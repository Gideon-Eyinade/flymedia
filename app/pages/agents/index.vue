<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { agents } from '~/data/agents'
import { allAreas, findArea } from '~/data/locations'

useSeoMeta({
  title: 'Find a real estate agent',
  description: 'Browse verified real estate agents, agencies and property managers in Lagos, Abuja, Port Harcourt and Ibadan. See their areas, active listings and reviews.',
})

const route = useRoute()
const router = useRouter()

const q = ref(typeof route.query.q === 'string' ? route.query.q : '')
const area = ref(typeof route.query.area === 'string' ? route.query.area : '')
const verifiedOnly = ref(route.query.verified === '1')
const kind = ref(typeof route.query.kind === 'string' ? route.query.kind : '')

watch([q, area, verifiedOnly, kind], () => {
  const query: Record<string, string> = {}
  if (q.value.trim()) query.q = q.value.trim()
  if (area.value) query.area = area.value
  if (verifiedOnly.value) query.verified = '1'
  if (kind.value) query.kind = kind.value
  router.replace({ query })
})

const results = computed(() => {
  const term = q.value.trim().toLowerCase()
  return agents
    .filter((a) => !verifiedOnly.value || a.verified)
    .filter((a) => !kind.value || a.kind === kind.value)
    .filter((a) => !area.value || a.areas.includes(area.value))
    .filter((a) => {
      if (!term) return true
      const hay = [a.name, a.agency, ...a.areas.map((s) => findArea(s)?.name)].join(' ').toLowerCase()
      return term.split(/\s+/).every((w) => hay.includes(w))
    })
    .sort((a, b) => Number(b.verified) - Number(a.verified) || b.rating - a.rating)
})

function reset() {
  q.value = ''
  area.value = ''
  verifiedOnly.value = false
  kind.value = ''
}
</script>

<template>
  <div>
    <section class="border-b border-mist-200 bg-mist-50">
      <div class="container-page py-10">
        <Breadcrumbs :items="[{ label: 'Home', to: '/' }, { label: 'Agents' }]" />
        <h1 class="mt-3 text-3xl font-extrabold">Find an agent</h1>
        <p class="mt-2 max-w-2xl text-[15px] text-mist-600">
          Agents, agencies and property managers who list on Flymedia. Verified agents have passed identity and business
          checks. Every agent must re-confirm their listings weekly.
        </p>

        <div class="mt-6 grid gap-3 rounded-[var(--radius-card)] border border-mist-200 bg-white p-4 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div class="relative">
            <label for="agent-q" class="sr-only">Agent or agency name</label>
            <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist-400" />
            <input id="agent-q" v-model="q" type="search" class="field pl-9" placeholder="Agent or agency name" />
          </div>
          <div>
            <label for="agent-area" class="sr-only">Area of operation</label>
            <select id="agent-area" v-model="area" class="field">
              <option value="">All areas</option>
              <option v-for="a in allAreas" :key="a.slug" :value="a.slug">{{ a.name }}, {{ a.cityName }}</option>
            </select>
          </div>
          <div>
            <label for="agent-kind" class="sr-only">Type</label>
            <select id="agent-kind" v-model="kind" class="field">
              <option value="">All agent types</option>
              <option value="agency">Agencies</option>
              <option value="independent">Independent agents</option>
              <option value="property_manager">Property managers</option>
            </select>
          </div>
          <label class="flex h-11 cursor-pointer items-center gap-2 px-1 text-sm font-medium text-mist-800">
            <input v-model="verifiedOnly" type="checkbox" class="checkbox" /> Verified only
          </label>
        </div>
      </div>
    </section>

    <section class="container-page py-10">
      <p class="mb-5 text-sm text-mist-600"><strong class="font-semibold text-mist-950 tabular">{{ results.length }}</strong> {{ results.length === 1 ? 'agent' : 'agents' }}</p>
      <div v-if="results.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AgentCard v-for="a in results" :key="a.id" :agent="a" />
      </div>
      <EmptyState v-else title="No agents match your search" body="Try a different name or area.">
        <button type="button" class="btn btn-secondary" @click="reset">Clear search</button>
      </EmptyState>
    </section>
  </div>
</template>
