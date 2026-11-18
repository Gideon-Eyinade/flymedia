<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { propertyTypes } from '~/data/catalog'

const router = useRouter()
const form = reactive({ area: '', keyword: '', type: '', beds: '', max: '' })

const budgets = [500_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 5_000_000, 7_500_000, 10_000_000, 15_000_000, 25_000_000, 50_000_000]

function submit() {
  router.push(
    searchLink({
      area: form.area,
      q: form.keyword,
      type: form.type,
      beds: form.beds,
      max: form.max,
    }),
  )
}
</script>

<template>
  <form
    class="rounded-2xl bg-white p-3 shadow-[0_24px_60px_-20px_rgb(13_13_15/0.45)] ring-1 ring-black/5 sm:p-4"
    role="search"
    aria-label="Search apartments"
    @submit.prevent="submit"
  >
    <div class="grid gap-3 md:grid-cols-[1.6fr_1.1fr_0.9fr_1fr_auto]">
      <div>
        <label for="hero-location" class="field-label">Location</label>
        <LocationInput
          id="hero-location"
          :area="form.area"
          :keyword="form.keyword"
          @select="(v) => { form.area = v.area; form.keyword = v.keyword }"
        />
      </div>
      <div>
        <label for="hero-type" class="field-label">Property type</label>
        <select id="hero-type" v-model="form.type" class="field">
          <option value="">Any type</option>
          <option v-for="t in propertyTypes" :key="t.slug" :value="t.slug">{{ t.name }}</option>
        </select>
      </div>
      <div>
        <label for="hero-beds" class="field-label">Bedrooms</label>
        <select id="hero-beds" v-model="form.beds" class="field">
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>
      <div>
        <label for="hero-max" class="field-label">Max budget (per year)</label>
        <select id="hero-max" v-model="form.max" class="field">
          <option value="">No limit</option>
          <option v-for="b in budgets" :key="b" :value="String(b)">{{ formatNaira(b) }}</option>
        </select>
      </div>
      <div class="flex items-end">
        <button type="submit" class="btn btn-primary h-11 w-full px-6 md:w-auto">
          <Search class="size-4" /> Search
        </button>
      </div>
    </div>
  </form>
</template>
