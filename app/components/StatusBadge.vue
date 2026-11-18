<script setup lang="ts">
import type { AvailabilityStatus } from '~/types'

const props = withDefaults(defineProps<{ status: AvailabilityStatus; size?: 'sm' | 'md' }>(), { size: 'sm' })
const meta = computed(() => statusMeta[props.status])
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset"
    :class="[meta.badge, size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs']"
    :title="meta.description"
  >
    <span class="size-1.5 rounded-full" :class="meta.dot" />
    {{ meta.short }}
  </span>
</template>
