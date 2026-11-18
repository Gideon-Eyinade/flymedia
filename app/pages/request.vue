<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { propertyTypes } from '~/data/catalog'
import { allAreas } from '~/data/locations'

useSeoMeta({
  title: 'Request an apartment',
  description: 'Can’t find the right apartment? Tell Flymedia what you need and we’ll share your request with agents who cover your preferred areas.',
})

const { show } = useToast()
const done = ref(false)
const form = reactive({
  areas: [] as string[],
  type: '',
  bedrooms: '',
  budget: '',
  moveBy: '',
  furnishing: '',
  needs: '',
  name: '',
  phone: '',
  email: '',
  contactByWhatsApp: true,
})
const errors = reactive<Record<string, string>>({})

function toggleArea(slug: string) {
  form.areas = form.areas.includes(slug) ? form.areas.filter((a) => a !== slug) : [...form.areas, slug].slice(0, 5)
}

function submit() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!form.areas.length) errors.areas = 'Choose at least one preferred area.'
  if (!form.budget) errors.budget = 'Choose your maximum budget.'
  if (form.name.trim().length < 2) errors.name = 'Enter your name.'
  if (!/^(0\d{10}|234\d{10})$/.test(form.phone.replace(/\D/g, ''))) errors.phone = 'Enter a Nigerian phone number.'
  if (Object.keys(errors).length) {
    show('Check the highlighted fields.', 'error')
    return
  }
  done.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="bg-mist-50">
    <div class="container-page grid gap-10 py-10 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <Breadcrumbs :items="[{ label: 'Home', to: '/' }, { label: 'Request an apartment' }]" />
        <h1 class="mt-3 text-3xl font-extrabold">Request an apartment</h1>
        <p class="mt-3 text-[15px] leading-7 text-mist-600">
          Can’t find what you need? Tell us where you want to live and your budget. We’ll share your request with
          verified agents who cover those areas, and they’ll contact you with matching homes.
        </p>
        <ul class="mt-6 space-y-3 text-sm text-mist-700">
          <li v-for="t in ['Free, and no obligation', 'Only verified agents see your request', 'Your number is shared only with agents who have a match', 'Requests expire after 30 days']" :key="t" class="flex items-center gap-2">
            <Check class="size-4 text-brand-600" /> {{ t }}
          </li>
        </ul>
      </div>

      <div class="rounded-2xl border border-mist-200 bg-white p-5 sm:p-8">
        <div v-if="done" class="text-center">
          <div class="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check class="size-7" /></div>
          <h2 class="mt-5 text-2xl font-extrabold">Request received</h2>
          <p class="mt-2 text-[15px] leading-7 text-mist-600">We’ll share it with agents in your chosen areas. Expect calls or WhatsApp messages from agents with matching homes.</p>
          <DemoNotice class="mt-6 text-left" />
          <NuxtLink to="/apartments" class="btn btn-primary mt-6">Keep browsing</NuxtLink>
        </div>

        <form v-else class="grid gap-5" novalidate @submit.prevent="submit">
          <fieldset>
            <legend class="field-label">Preferred locations <span class="font-normal text-mist-400">(up to 5)</span></legend>
            <div class="mt-1 flex flex-wrap gap-2">
              <button
                v-for="a in allAreas"
                :key="a.slug"
                type="button"
                class="rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset transition-colors"
                :class="form.areas.includes(a.slug) ? 'bg-brand-700 text-white ring-brand-700' : 'bg-white text-mist-700 ring-mist-200 hover:ring-mist-300'"
                :aria-pressed="form.areas.includes(a.slug)"
                @click="toggleArea(a.slug)"
              >
                {{ a.name }}
              </button>
            </div>
            <p v-if="errors.areas" class="mt-1 text-xs text-rose-700">{{ errors.areas }}</p>
          </fieldset>
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="rq-type" class="field-label">Property type</label>
              <select id="rq-type" v-model="form.type" class="field">
                <option value="">Any type</option>
                <option v-for="t in propertyTypes" :key="t.slug" :value="t.slug">{{ t.name }}</option>
              </select>
            </div>
            <div>
              <label for="rq-beds" class="field-label">Bedrooms</label>
              <select id="rq-beds" v-model="form.bedrooms" class="field">
                <option value="">Any</option>
                <option v-for="n in [1, 2, 3, 4, 5]" :key="n" :value="String(n)">{{ n }}+</option>
              </select>
            </div>
            <div>
              <label for="rq-budget" class="field-label">Maximum budget (per year)</label>
              <select id="rq-budget" v-model="form.budget" class="field" :aria-invalid="!!errors.budget">
                <option value="">Choose a budget</option>
                <option v-for="b in [1_000_000, 2_000_000, 3_000_000, 5_000_000, 7_500_000, 10_000_000, 15_000_000, 25_000_000, 50_000_000]" :key="b" :value="String(b)">Up to {{ formatNaira(b) }}</option>
              </select>
              <p v-if="errors.budget" class="mt-1 text-xs text-rose-700">{{ errors.budget }}</p>
            </div>
            <div>
              <label for="rq-move" class="field-label">Move-in by</label>
              <select id="rq-move" v-model="form.moveBy" class="field">
                <option value="">Flexible</option>
                <option value="asap">As soon as possible</option>
                <option value="1m">Within 1 month</option>
                <option value="3m">Within 3 months</option>
              </select>
            </div>
          </div>
          <div>
            <label for="rq-needs" class="field-label">Anything else? <span class="font-normal text-mist-400">(optional)</span></label>
            <textarea id="rq-needs" v-model="form.needs" rows="3" class="field" placeholder="e.g. Must have parking and steady water. Close to Yaba." />
          </div>
          <div class="grid gap-5 border-t border-mist-100 pt-5 sm:grid-cols-2">
            <div>
              <label for="rq-name" class="field-label">Your name</label>
              <input id="rq-name" v-model="form.name" class="field" autocomplete="name" :aria-invalid="!!errors.name" />
              <p v-if="errors.name" class="mt-1 text-xs text-rose-700">{{ errors.name }}</p>
            </div>
            <div>
              <label for="rq-phone" class="field-label">Phone number</label>
              <input id="rq-phone" v-model="form.phone" type="tel" class="field" autocomplete="tel" placeholder="0803 123 4567" :aria-invalid="!!errors.phone" />
              <p v-if="errors.phone" class="mt-1 text-xs text-rose-700">{{ errors.phone }}</p>
            </div>
            <div class="sm:col-span-2">
              <label for="rq-email" class="field-label">Email <span class="font-normal text-mist-400">(optional)</span></label>
              <input id="rq-email" v-model="form.email" type="email" class="field" autocomplete="email" />
            </div>
            <label class="flex cursor-pointer items-center gap-2.5 text-sm text-mist-800 sm:col-span-2">
              <input v-model="form.contactByWhatsApp" type="checkbox" class="checkbox" /> Agents can contact me on WhatsApp
            </label>
          </div>
          <button type="submit" class="btn btn-primary">Send request</button>
        </form>
      </div>
    </div>
  </div>
</template>
