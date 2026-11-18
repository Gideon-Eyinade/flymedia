<script setup lang="ts">
import { Info, CircleAlert } from 'lucide-vue-next'
import type { Listing } from '~/types'

const props = defineProps<{ listing: Listing }>()

const cost = computed(() => moveInCost(props.listing))
const oneTime = computed(() => props.listing.charges.filter((c) => c.recurrence === 'one_time'))
const recurring = computed(() => props.listing.charges.filter((c) => c.recurrence !== 'one_time'))
const rentLabel = computed(() =>
  props.listing.period === 'year'
    ? `Rent (${plural(props.listing.upfrontPeriods, 'year')} upfront)`
    : `Rent (${props.listing.upfrontPeriods} months upfront at ${formatNaira(props.listing.rent)}/month)`,
)
const missing = computed(() => {
  const types = new Set(props.listing.charges.map((c) => c.type))
  return [
    !types.has('agency_fee') && 'agency fee',
    !types.has('legal_fee') && 'legal fee',
    !types.has('caution_deposit') && 'caution deposit',
    !types.has('service_charge') && 'service charge',
  ].filter(Boolean) as string[]
})
</script>

<template>
  <div class="overflow-hidden rounded-[var(--radius-card)] border border-mist-200">
    <table class="w-full text-sm">
      <caption class="sr-only">Rent and charges</caption>
      <thead class="bg-mist-50 text-left text-xs uppercase tracking-wider text-mist-500">
        <tr>
          <th scope="col" class="px-4 py-2.5 font-semibold">Charge</th>
          <th scope="col" class="hidden px-4 py-2.5 font-semibold sm:table-cell">Type</th>
          <th scope="col" class="px-4 py-2.5 text-right font-semibold">Amount</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-mist-100">
        <tr>
          <th scope="row" class="px-4 py-3 text-left font-medium text-mist-900">{{ rentLabel }}</th>
          <td class="hidden px-4 py-3 text-mist-600 sm:table-cell">Recurring, {{ listing.period === 'year' ? 'yearly' : 'monthly' }}</td>
          <td class="px-4 py-3 text-right font-semibold text-mist-950 tabular">{{ formatNaira(cost.rentUpfront) }}</td>
        </tr>
        <tr v-for="c in recurring" :key="c.label">
          <th scope="row" class="px-4 py-3 text-left font-medium text-mist-900">
            {{ c.label }}
            <span class="block text-xs font-normal text-mist-500 sm:hidden">Recurring, {{ c.recurrence === 'yearly' ? 'yearly' : 'monthly' }}</span>
          </th>
          <td class="hidden px-4 py-3 text-mist-600 sm:table-cell">Recurring, {{ c.recurrence === 'yearly' ? 'yearly' : 'monthly' }}</td>
          <td class="px-4 py-3 text-right font-semibold text-mist-950 tabular">{{ formatNaira(c.amount) }}</td>
        </tr>
        <tr v-for="c in oneTime" :key="c.label">
          <th scope="row" class="px-4 py-3 text-left font-medium text-mist-900">
            {{ c.label }}
            <span class="block text-xs font-normal text-mist-500 sm:hidden">One-time{{ c.refundable ? ', refundable' : '' }}</span>
          </th>
          <td class="hidden px-4 py-3 text-mist-600 sm:table-cell">One-time{{ c.refundable ? ', refundable' : '' }}</td>
          <td class="px-4 py-3 text-right font-semibold text-mist-950 tabular">{{ formatNaira(c.amount) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr v-if="cost.total !== null" class="bg-brand-50">
          <th scope="row" class="px-4 py-3.5 text-left font-bold text-brand-900" colspan="1">Total to move in</th>
          <td class="hidden sm:table-cell" />
          <td class="px-4 py-3.5 text-right font-display text-base font-extrabold text-brand-900 tabular">{{ formatNaira(cost.total) }}</td>
        </tr>
      </tfoot>
    </table>
    <div v-if="cost.total === null" class="flex items-start gap-2 border-t border-mist-200 bg-amber-50 px-4 py-3 text-[13px] leading-5 text-amber-900">
      <CircleAlert class="mt-0.5 size-4 shrink-0" />
      <p>
        The agent hasn’t confirmed that these are all the charges, so we don’t show a move-in total. Ask the agent for
        the full breakdown before you pay anything.
      </p>
    </div>
    <div v-else-if="missing.length" class="flex items-start gap-2 border-t border-mist-200 px-4 py-3 text-[13px] leading-5 text-mist-600">
      <Info class="mt-0.5 size-4 shrink-0 text-mist-400" />
      <p>The agent has confirmed there is no {{ missing.join(' or ') }} on this property.</p>
    </div>
  </div>
</template>
