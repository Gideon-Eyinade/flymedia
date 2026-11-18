<script setup lang="ts">
import type { Agent } from '~/types'
import { agentInitials } from '~/data/agents'

const props = withDefaults(defineProps<{ agent: Agent; size?: 'sm' | 'md' | 'lg' | 'xl' }>(), { size: 'md' })
const sizes = { sm: 'size-9 text-xs', md: 'size-12 text-sm', lg: 'size-16 text-lg', xl: 'size-24 text-2xl' }
const isAgency = computed(() => props.agent.kind !== 'independent')
</script>

<template>
  <span
    class="grid shrink-0 place-items-center font-display font-extrabold tracking-tight text-white"
    :class="[sizes[size], isAgency ? 'rounded-xl' : 'rounded-full']"
    :style="{ backgroundColor: agent.monogramColor }"
    aria-hidden="true"
  >
    {{ agentInitials(agent.name) }}
  </span>
</template>
