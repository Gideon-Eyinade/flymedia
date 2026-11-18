<script setup lang="ts">
import type { SearchFilters } from '~/composables/useListingSearch'
import { states, findState, findCity } from '~/data/locations'
import { propertyTypes, amenities, keyAmenityFilters } from '~/data/catalog'

const props = defineProps<{ filters: SearchFilters; idPrefix: string }>()
const emit = defineEmits<{ update: [mutator: (f: SearchFilters) => void] }>()

const set = (mutator: (f: SearchFilters) => void) => emit('update', mutator)

const cities = computed(() => findState(props.filters.state)?.cities ?? [])
const areas = computed(() => {
  if (props.filters.city) return findCity(props.filters.city)?.areas ?? []
  return cities.value.flatMap((c) => c.areas)
})

const priceSteps = [250_000, 500_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 4_000_000, 5_000_000, 7_500_000, 10_000_000, 15_000_000, 25_000_000, 50_000_000, 100_000_000]

const showAllAmenities = ref(false)
const keyAmenities = computed(() => amenities.filter((a) => keyAmenityFilters.includes(a.id)))
const otherAmenities = computed(() => amenities.filter((a) => !keyAmenityFilters.includes(a.id)))

function toggleAmenity(id: string) {
  set((f) => {
    f.amenities = f.amenities.includes(id) ? f.amenities.filter((a) => a !== id) : [...f.amenities, id]
  })
}

const segBtn = (active: boolean) =>
  [
    'h-9 flex-1 rounded-md text-sm font-medium transition-colors',
    active ? 'bg-white text-mist-950 shadow-sm ring-1 ring-mist-200' : 'text-mist-600 hover:text-mist-900',
  ].join(' ')
</script>

<template>
  <div class="divide-y divide-mist-200">
    <!-- Location -->
    <fieldset class="pb-5">
      <legend class="mb-3 text-sm font-bold text-mist-950">Location</legend>
      <div class="grid gap-3">
        <div>
          <label :for="`${idPrefix}-state`" class="field-label">State</label>
          <select
            :id="`${idPrefix}-state`"
            class="field"
            :value="filters.state"
            @change="set((f) => { f.state = ($event.target as HTMLSelectElement).value; f.city = ''; f.area = '' })"
          >
            <option value="">All states</option>
            <option v-for="s in states" :key="s.slug" :value="s.slug">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <label :for="`${idPrefix}-city`" class="field-label">City</label>
          <select
            :id="`${idPrefix}-city`"
            class="field"
            :value="filters.city"
            :disabled="!filters.state"
            @change="set((f) => { f.city = ($event.target as HTMLSelectElement).value; f.area = '' })"
          >
            <option value="">{{ filters.state ? 'All cities' : 'Choose a state first' }}</option>
            <option v-for="c in cities" :key="c.slug" :value="c.slug">{{ c.name }}</option>
          </select>
        </div>
        <div>
          <label :for="`${idPrefix}-area`" class="field-label">Area / neighbourhood</label>
          <select
            :id="`${idPrefix}-area`"
            class="field"
            :value="filters.area"
            :disabled="!filters.state"
            @change="set((f) => { f.area = ($event.target as HTMLSelectElement).value })"
          >
            <option value="">{{ filters.state ? 'All areas' : 'Choose a state first' }}</option>
            <option v-for="a in areas" :key="a.slug" :value="a.slug">{{ a.name }}</option>
          </select>
        </div>
      </div>
    </fieldset>

    <!-- Type -->
    <fieldset class="py-5">
      <legend class="mb-3 text-sm font-bold text-mist-950">Property type</legend>
      <select
        :id="`${idPrefix}-type`"
        class="field"
        aria-label="Property type"
        :value="filters.type"
        @change="set((f) => { f.type = ($event.target as HTMLSelectElement).value })"
      >
        <option value="">Any type</option>
        <option v-for="t in propertyTypes" :key="t.slug" :value="t.slug">{{ t.name }}</option>
      </select>
    </fieldset>

    <!-- Price -->
    <fieldset class="py-5">
      <legend class="mb-1 text-sm font-bold text-mist-950">Rent per year</legend>
      <p class="mb-3 text-xs text-mist-500">Monthly rents are compared at their yearly total.</p>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label :for="`${idPrefix}-min`" class="field-label">Min</label>
          <select :id="`${idPrefix}-min`" class="field" :value="filters.min" @change="set((f) => { f.min = ($event.target as HTMLSelectElement).value })">
            <option value="">No min</option>
            <option v-for="p in priceSteps" :key="p" :value="String(p)">{{ formatNairaCompact(p) }}</option>
          </select>
        </div>
        <div>
          <label :for="`${idPrefix}-max`" class="field-label">Max</label>
          <select :id="`${idPrefix}-max`" class="field" :value="filters.max" @change="set((f) => { f.max = ($event.target as HTMLSelectElement).value })">
            <option value="">No max</option>
            <option v-for="p in priceSteps" :key="p" :value="String(p)">{{ formatNairaCompact(p) }}</option>
          </select>
        </div>
      </div>
    </fieldset>

    <!-- Rooms -->
    <fieldset class="py-5">
      <legend class="mb-3 text-sm font-bold text-mist-950">Bedrooms</legend>
      <div class="flex gap-1 rounded-lg bg-mist-100 p-1">
        <button v-for="b in ['', '1', '2', '3', '4', '5']" :key="b" type="button" :class="segBtn(filters.beds === b)" :aria-pressed="filters.beds === b" @click="set((f) => { f.beds = b })">
          {{ b ? `${b}+` : 'Any' }}
        </button>
      </div>
      <p class="mb-3 mt-5 text-sm font-bold text-mist-950">Bathrooms</p>
      <div class="flex gap-1 rounded-lg bg-mist-100 p-1">
        <button v-for="b in ['', '1', '2', '3', '4']" :key="b" type="button" :class="segBtn(filters.baths === b)" :aria-pressed="filters.baths === b" @click="set((f) => { f.baths = b })">
          {{ b ? `${b}+` : 'Any' }}
        </button>
      </div>
    </fieldset>

    <!-- Furnishing / servicing -->
    <fieldset class="py-5">
      <legend class="mb-3 text-sm font-bold text-mist-950">Furnishing</legend>
      <div class="grid gap-2">
        <label v-for="o in [{ v: '', l: 'Any' }, { v: 'furnished', l: 'Furnished' }, { v: 'semi_furnished', l: 'Semi-furnished' }, { v: 'unfurnished', l: 'Unfurnished' }]" :key="o.v" class="flex cursor-pointer items-center gap-2.5 text-sm text-mist-800">
          <input type="radio" :name="`${idPrefix}-furnishing`" class="size-4 accent-brand-700" :checked="filters.furnishing === o.v" @change="set((f) => { f.furnishing = o.v })" />
          {{ o.l }}
        </label>
      </div>
      <p class="mb-3 mt-5 text-sm font-bold text-mist-950">Servicing</p>
      <div class="flex gap-1 rounded-lg bg-mist-100 p-1">
        <button v-for="o in [{ v: '', l: 'Any' }, { v: '1', l: 'Serviced' }, { v: '0', l: 'Not serviced' }]" :key="o.v" type="button" :class="segBtn(filters.serviced === o.v)" :aria-pressed="filters.serviced === o.v" @click="set((f) => { f.serviced = o.v })">
          {{ o.l }}
        </button>
      </div>
      <div class="mt-5 grid gap-2.5">
        <label class="flex cursor-pointer items-center gap-2.5 text-sm text-mist-800">
          <input type="checkbox" class="checkbox" :checked="filters.newbuild === '1'" @change="set((f) => { f.newbuild = f.newbuild ? '' : '1' })" />
          Newly built only
        </label>
        <label class="flex cursor-pointer items-center gap-2.5 text-sm text-mist-800">
          <input type="checkbox" class="checkbox" :checked="filters.verified === '1'" @change="set((f) => { f.verified = f.verified ? '' : '1' })" />
          Flymedia verified homes only
        </label>
      </div>
    </fieldset>

    <!-- Amenities -->
    <fieldset class="pt-5">
      <legend class="mb-3 text-sm font-bold text-mist-950">Utilities and amenities</legend>
      <div class="grid gap-2.5">
        <label v-for="a in keyAmenities" :key="a.id" class="flex cursor-pointer items-center gap-2.5 text-sm text-mist-800">
          <input type="checkbox" class="checkbox" :checked="filters.amenities.includes(a.id)" @change="toggleAmenity(a.id)" />
          {{ a.name }}
        </label>
        <template v-if="showAllAmenities">
          <label v-for="a in otherAmenities" :key="a.id" class="flex cursor-pointer items-center gap-2.5 text-sm text-mist-800">
            <input type="checkbox" class="checkbox" :checked="filters.amenities.includes(a.id)" @change="toggleAmenity(a.id)" />
            {{ a.name }}
          </label>
        </template>
      </div>
      <button type="button" class="mt-3 text-sm font-semibold text-brand-700 hover:text-brand-800" @click="showAllAmenities = !showAllAmenities">
        {{ showAllAmenities ? 'Show fewer amenities' : `Show ${otherAmenities.length} more amenities` }}
      </button>
    </fieldset>
  </div>
</template>
