<script setup lang="ts">
import { Check, ChevronLeft, ChevronRight, ImagePlus, Trash2, Star, Video, ShieldCheck, Receipt, MessageCircle, BarChart3 } from 'lucide-vue-next'
import type { Listing, Furnishing } from '~/types'
import { propertyTypes, amenities } from '~/data/catalog'
import { states, findState, findCity, findArea } from '~/data/locations'

useSeoMeta({
  title: 'List a property',
  description: 'List your apartment on Flymedia. Reach tenants who are ready to inspect, confirm availability in one click and manage enquiries from your phone.',
})

const { show } = useToast()

const steps = ['Basic information', 'Location', 'Property details', 'Pricing', 'Photos and media', 'Contact and availability', 'Preview and submit']
const step = ref(0)
const submitted = ref(false)
const errors = reactive<Record<string, string>>({})
const formTop = ref<HTMLElement | null>(null)

const form = reactive({
  title: '',
  type: '',
  description: '',
  state: '',
  city: '',
  area: '',
  neighbourhood: '',
  street: '',
  lat: '',
  lng: '',
  bedrooms: 2,
  bathrooms: 2,
  toilets: 3,
  sizeSqm: '',
  furnishing: 'unfurnished' as Furnishing,
  serviced: false,
  condition: 'good' as Listing['condition'],
  amenities: [] as string[],
  period: 'year' as 'year' | 'month',
  rent: '',
  upfront: '1',
  agencyFee: '',
  legalFee: '',
  caution: '',
  serviceCharge: '',
  otherLabel: '',
  otherAmount: '',
  chargesComplete: false,
  photos: [] as { name: string; url: string }[],
  coverIndex: 0,
  videoUrl: '',
  agentName: '',
  agentPhone: '',
  agentWhatsApp: '',
  agentEmail: '',
  availability: 'available',
  confirmNow: false,
})

const cities = computed(() => findState(form.state)?.cities ?? [])
const areas = computed(() => findCity(form.city)?.areas ?? [])
const hoods = computed(() => findArea(form.area)?.neighbourhoods ?? [])

watch(() => form.state, () => { form.city = cities.value.length === 1 ? cities.value[0]!.slug : ''; form.area = '' })
watch(() => form.city, () => { form.area = '' })
watch(() => form.area, () => { form.neighbourhood = '' })

const num = (v: string) => Number(String(v).replace(/[^\d]/g, '')) || 0
const moneyFields = ['rent', 'agencyFee', 'legalFee', 'caution', 'serviceCharge', 'otherAmount'] as const
function formatMoney(key: (typeof moneyFields)[number]) {
  const n = num(form[key])
  form[key] = n ? new Intl.NumberFormat('en-NG').format(n) : ''
}

const totalUpfront = computed(() => {
  const rent = num(form.rent) * (num(form.upfront) || 1)
  return rent + num(form.agencyFee) + num(form.legalFee) + num(form.caution) + num(form.serviceCharge) + num(form.otherAmount)
})

function onFiles(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  for (const f of Array.from(files).slice(0, 20 - form.photos.length)) {
    if (!f.type.startsWith('image/')) continue
    form.photos.push({ name: f.name, url: URL.createObjectURL(f) })
  }
  ;(e.target as HTMLInputElement).value = ''
}
function removePhoto(i: number) {
  URL.revokeObjectURL(form.photos[i]!.url)
  form.photos.splice(i, 1)
  if (form.coverIndex >= form.photos.length) form.coverIndex = 0
}
onBeforeUnmount(() => form.photos.forEach((p) => URL.revokeObjectURL(p.url)))

function validateStep(i: number) {
  for (const k of Object.keys(errors)) delete errors[k]
  if (i === 0) {
    if (form.title.trim().length < 6) errors.title = 'Give the property a short, descriptive title.'
    if (!form.type) errors.type = 'Choose a property type.'
    if (form.description.trim().length < 40) errors.description = 'Describe the property in at least 40 characters.'
  }
  if (i === 1) {
    if (!form.state) errors.state = 'Choose a state.'
    if (!form.city) errors.city = 'Choose a city.'
    if (!form.area) errors.area = 'Choose an area.'
    if (!form.street.trim()) errors.street = 'Add the street or estate name. It is only shared after an inspection is booked.'
  }
  if (i === 3) {
    if (!num(form.rent)) errors.rent = 'Enter the rent.'
    if (!form.chargesComplete) errors.chargesComplete = 'Confirm that these are all the charges a tenant will pay.'
  }
  if (i === 4) {
    if (form.photos.length < 3) errors.photos = 'Add at least 3 photos, including the main photograph.'
  }
  if (i === 5) {
    if (form.agentName.trim().length < 2) errors.agentName = 'Enter the contact name.'
    if (!/^(0\d{10}|234\d{10})$/.test(form.agentPhone.replace(/\D/g, ''))) errors.agentPhone = 'Enter a Nigerian phone number.'
    if (form.availability === 'available' && !form.confirmNow) errors.confirmNow = 'Confirm the property is available today.'
  }
  return Object.keys(errors).length === 0
}

function next() {
  if (!validateStep(step.value)) {
    show('Check the highlighted fields.', 'error')
    return
  }
  step.value = Math.min(step.value + 1, steps.length - 1)
  formTop.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function back() {
  step.value = Math.max(step.value - 1, 0)
  formTop.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function goTo(i: number) {
  if (i < step.value) step.value = i
}
function submit() {
  submitted.value = true
  formTop.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const previewLocation = computed(() =>
  [form.neighbourhood, findArea(form.area)?.name, findCity(form.city)?.name].filter((v, i, a) => v && a.indexOf(v) === i).join(', '),
)

const benefits = [
  { icon: ShieldCheck, title: 'Build trust with fresh listings', body: 'Confirmed listings rank higher and carry a “last confirmed” date tenants trust.' },
  { icon: Receipt, title: 'Show the full cost', body: 'Itemised fees mean fewer wasted inspections and faster decisions.' },
  { icon: MessageCircle, title: 'Leads on WhatsApp', body: 'Enquiries and inspection requests go straight to your phone.' },
  { icon: BarChart3, title: 'See what works', body: 'Track views, saves and enquiries for every listing.' },
]
</script>

<template>
  <div class="bg-mist-50">
    <section class="border-b border-mist-200 bg-white">
      <div class="container-page grid gap-8 py-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <Breadcrumbs :items="[{ label: 'Home', to: '/' }, { label: 'List a property' }]" />
          <h1 class="mt-3 text-3xl font-extrabold sm:text-4xl">List your property on Flymedia</h1>
          <p class="mt-3 max-w-xl text-[15px] leading-7 text-mist-600">
            Reach people who are ready to rent. Every listing is reviewed by our team before it goes live, unless you’re a
            trusted agent with auto-publishing enabled.
          </p>
        </div>
        <ul class="grid gap-4 sm:grid-cols-2">
          <li v-for="b in benefits" :key="b.title" class="flex gap-3">
            <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700"><component :is="b.icon" class="size-4" /></span>
            <span class="text-sm leading-5"><strong class="block font-semibold text-mist-950">{{ b.title }}</strong><span class="text-mist-600">{{ b.body }}</span></span>
          </li>
        </ul>
      </div>
    </section>

    <div ref="formTop" class="container-page scroll-mt-20 py-10">
      <!-- Submitted -->
      <div v-if="submitted" class="mx-auto max-w-xl rounded-2xl border border-mist-200 bg-white p-8 text-center">
        <div class="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check class="size-7" /></div>
        <h2 class="mt-5 text-2xl font-extrabold">Submitted for review</h2>
        <p class="mt-2 text-[15px] leading-7 text-mist-600">
          “{{ form.title }}” is now <strong class="font-semibold text-mist-900">pending review</strong>. Our team usually
          reviews new listings within one working day. You’ll be reminded to confirm availability every 7 days once it’s live.
        </p>
        <DemoNotice class="mt-6 text-left" text="Preview build: this listing was not saved. Listing submission will be connected when accounts and the database are added." />
        <div class="mt-6 flex justify-center gap-2">
          <NuxtLink to="/" class="btn btn-secondary">Back to home</NuxtLink>
          <button type="button" class="btn btn-primary" @click="submitted = false; step = 0">Start another listing</button>
        </div>
      </div>

      <div v-else class="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <!-- Stepper -->
        <nav aria-label="Listing steps">
          <ol class="no-scrollbar flex gap-2 overflow-x-auto lg:sticky lg:top-20 lg:flex-col lg:gap-0">
            <li v-for="(s, i) in steps" :key="s" class="shrink-0">
              <button
                type="button"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
                :class="[
                  i === step ? 'bg-white font-semibold text-mist-950 ring-1 ring-mist-200' : 'text-mist-600',
                  i < step ? 'cursor-pointer hover:text-mist-900' : 'cursor-default',
                ]"
                :aria-current="i === step ? 'step' : undefined"
                @click="goTo(i)"
              >
                <span
                  class="grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold"
                  :class="i < step ? 'bg-brand-700 text-white' : i === step ? 'bg-mist-950 text-white' : 'bg-mist-200 text-mist-600'"
                >
                  <Check v-if="i < step" class="size-3.5" />
                  <template v-else>{{ i + 1 }}</template>
                </span>
                <span class="whitespace-nowrap">{{ s }}</span>
              </button>
            </li>
          </ol>
        </nav>

        <form class="min-w-0 rounded-2xl border border-mist-200 bg-white p-5 sm:p-8" novalidate @submit.prevent="step === steps.length - 1 ? submit() : next()">
          <p class="text-xs font-semibold uppercase tracking-wider text-mist-500">Step {{ step + 1 }} of {{ steps.length }}</p>
          <h2 class="mt-1 text-xl font-extrabold">{{ steps[step] }}</h2>

          <!-- Step 1 -->
          <div v-if="step === 0" class="mt-6 grid gap-5">
            <div>
              <label for="lp-title" class="field-label">Property title</label>
              <input id="lp-title" v-model="form.title" class="field" placeholder="e.g. 2 Bedroom Apartment with BQ" :aria-invalid="!!errors.title" />
              <p v-if="errors.title" class="mt-1 text-xs text-rose-700">{{ errors.title }}</p>
            </div>
            <div>
              <label for="lp-type" class="field-label">Property type</label>
              <select id="lp-type" v-model="form.type" class="field" :aria-invalid="!!errors.type">
                <option value="">Choose a type</option>
                <option v-for="t in propertyTypes" :key="t.slug" :value="t.slug">{{ t.name }}</option>
              </select>
              <p v-if="errors.type" class="mt-1 text-xs text-rose-700">{{ errors.type }}</p>
            </div>
            <div>
              <label for="lp-desc" class="field-label">Description</label>
              <textarea id="lp-desc" v-model="form.description" rows="6" class="field" placeholder="Describe the layout, the building, the neighbourhood and anything a tenant should know (water, power, road access)." :aria-invalid="!!errors.description" />
              <p class="mt-1 flex justify-between text-xs text-mist-500">
                <span v-if="errors.description" class="text-rose-700">{{ errors.description }}</span><span v-else>Be specific. Honest descriptions get more serious enquiries.</span>
                <span class="tabular">{{ form.description.length }}</span>
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div v-else-if="step === 1" class="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label for="lp-state" class="field-label">State</label>
              <select id="lp-state" v-model="form.state" class="field" :aria-invalid="!!errors.state">
                <option value="">Choose a state</option>
                <option v-for="s in states" :key="s.slug" :value="s.slug">{{ s.name }}</option>
              </select>
              <p v-if="errors.state" class="mt-1 text-xs text-rose-700">{{ errors.state }}</p>
            </div>
            <div>
              <label for="lp-city" class="field-label">City</label>
              <select id="lp-city" v-model="form.city" class="field" :disabled="!form.state" :aria-invalid="!!errors.city">
                <option value="">Choose a city</option>
                <option v-for="c in cities" :key="c.slug" :value="c.slug">{{ c.name }}</option>
              </select>
              <p v-if="errors.city" class="mt-1 text-xs text-rose-700">{{ errors.city }}</p>
            </div>
            <div>
              <label for="lp-area" class="field-label">Area</label>
              <select id="lp-area" v-model="form.area" class="field" :disabled="!form.city" :aria-invalid="!!errors.area">
                <option value="">Choose an area</option>
                <option v-for="a in areas" :key="a.slug" :value="a.slug">{{ a.name }}</option>
              </select>
              <p v-if="errors.area" class="mt-1 text-xs text-rose-700">{{ errors.area }}</p>
            </div>
            <div>
              <label for="lp-hood" class="field-label">Neighbourhood</label>
              <select id="lp-hood" v-model="form.neighbourhood" class="field" :disabled="!form.area">
                <option value="">Choose a neighbourhood</option>
                <option v-for="n in hoods" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label for="lp-street" class="field-label">Street or estate</label>
              <input id="lp-street" v-model="form.street" class="field" placeholder="e.g. Off Admiralty Way" :aria-invalid="!!errors.street" />
              <p v-if="errors.street" class="mt-1 text-xs text-rose-700">{{ errors.street }}</p>
              <p v-else class="mt-1 text-xs text-mist-500">Only the street or estate name is shown publicly. The full address is shared after an inspection is booked.</p>
            </div>
            <div>
              <label for="lp-lat" class="field-label">Latitude <span class="font-normal text-mist-400">(optional)</span></label>
              <input id="lp-lat" v-model="form.lat" class="field" inputmode="decimal" placeholder="6.4474" />
            </div>
            <div>
              <label for="lp-lng" class="field-label">Longitude <span class="font-normal text-mist-400">(optional)</span></label>
              <input id="lp-lng" v-model="form.lng" class="field" inputmode="decimal" placeholder="3.4723" />
            </div>
          </div>

          <!-- Step 3 -->
          <div v-else-if="step === 2" class="mt-6 grid gap-6">
            <div class="grid gap-5 sm:grid-cols-4">
              <div v-for="f in [{ k: 'bedrooms', l: 'Bedrooms' }, { k: 'bathrooms', l: 'Bathrooms' }, { k: 'toilets', l: 'Toilets' }] as const" :key="f.k">
                <label :for="`lp-${f.k}`" class="field-label">{{ f.l }}</label>
                <input :id="`lp-${f.k}`" v-model.number="form[f.k]" type="number" min="0" max="12" class="field" />
              </div>
              <div>
                <label for="lp-size" class="field-label">Floor area (m²)</label>
                <input id="lp-size" v-model="form.sizeSqm" type="number" min="0" class="field" placeholder="Optional" />
              </div>
            </div>
            <div class="grid gap-5 sm:grid-cols-3">
              <div>
                <label for="lp-furn" class="field-label">Furnishing</label>
                <select id="lp-furn" v-model="form.furnishing" class="field">
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi_furnished">Semi-furnished</option>
                  <option value="furnished">Furnished</option>
                </select>
              </div>
              <div>
                <label for="lp-cond" class="field-label">Building condition</label>
                <select id="lp-cond" v-model="form.condition" class="field">
                  <option value="newly_built">Newly built</option>
                  <option value="renovated">Renovated</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
              <label class="mt-6 flex h-11 cursor-pointer items-center gap-2.5 text-sm font-medium text-mist-800">
                <input v-model="form.serviced" type="checkbox" class="checkbox" /> Serviced apartment
              </label>
            </div>
            <fieldset>
              <legend class="field-label">Amenities and utilities</legend>
              <div class="mt-1 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <label v-for="a in amenities" :key="a.id" class="flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm" :class="form.amenities.includes(a.id) ? 'border-brand-400 bg-brand-50 text-brand-900' : 'border-mist-200 text-mist-800 hover:border-mist-300'">
                  <input v-model="form.amenities" type="checkbox" :value="a.id" class="checkbox" /> {{ a.name }}
                </label>
              </div>
            </fieldset>
          </div>

          <!-- Step 4 -->
          <div v-else-if="step === 3" class="mt-6 grid gap-5">
            <p class="rounded-lg bg-mist-50 px-4 py-3 text-sm leading-6 text-mist-700">
              Enter only amounts the landlord has agreed. Leave a fee blank if it doesn’t apply. Flymedia will never estimate missing fees.
            </p>
            <div class="grid gap-5 sm:grid-cols-3">
              <div>
                <label for="lp-period" class="field-label">Rent is paid</label>
                <select id="lp-period" v-model="form.period" class="field">
                  <option value="year">Yearly</option>
                  <option value="month">Monthly</option>
                </select>
              </div>
              <div>
                <label for="lp-rent" class="field-label">{{ form.period === 'year' ? 'Annual rent (₦)' : 'Monthly rent (₦)' }}</label>
                <input id="lp-rent" v-model="form.rent" inputmode="numeric" class="field tabular" placeholder="0" :aria-invalid="!!errors.rent" @blur="formatMoney('rent')" />
                <p v-if="errors.rent" class="mt-1 text-xs text-rose-700">{{ errors.rent }}</p>
              </div>
              <div>
                <label for="lp-upfront" class="field-label">{{ form.period === 'year' ? 'Years upfront' : 'Months upfront' }}</label>
                <input id="lp-upfront" v-model="form.upfront" type="number" min="1" :max="form.period === 'year' ? 3 : 12" class="field" />
              </div>
            </div>
            <div class="grid gap-5 sm:grid-cols-2">
              <div v-for="f in [{ k: 'agencyFee', l: 'Agency fee (₦)', h: 'One-time' }, { k: 'legalFee', l: 'Legal / agreement fee (₦)', h: 'One-time' }, { k: 'caution', l: 'Caution deposit (₦)', h: 'One-time, refundable' }, { k: 'serviceCharge', l: 'Service charge (₦ per year)', h: 'Recurring' }] as const" :key="f.k">
                <label :for="`lp-${f.k}`" class="field-label">{{ f.l }} <span class="font-normal text-mist-400">· {{ f.h }}</span></label>
                <input :id="`lp-${f.k}`" v-model="form[f.k]" inputmode="numeric" class="field tabular" placeholder="Leave blank if none" @blur="formatMoney(f.k)" />
              </div>
              <div>
                <label for="lp-other-label" class="field-label">Other charge <span class="font-normal text-mist-400">(optional)</span></label>
                <input id="lp-other-label" v-model="form.otherLabel" class="field" placeholder="e.g. Estate development levy" />
              </div>
              <div>
                <label for="lp-other-amount" class="field-label">Amount (₦)</label>
                <input id="lp-other-amount" v-model="form.otherAmount" inputmode="numeric" class="field tabular" placeholder="0" @blur="formatMoney('otherAmount')" />
              </div>
            </div>
            <div class="flex items-center justify-between rounded-lg bg-brand-50 px-4 py-3">
              <span class="text-sm font-semibold text-brand-900">Total a tenant pays to move in</span>
              <span class="font-display text-lg font-extrabold text-brand-900 tabular">{{ formatNaira(totalUpfront) }}</span>
            </div>
            <label class="flex cursor-pointer items-start gap-3 text-sm text-mist-800">
              <input v-model="form.chargesComplete" type="checkbox" class="checkbox mt-0.5" :aria-invalid="!!errors.chargesComplete" />
              <span>I confirm these are <strong>all</strong> the charges a tenant will pay before moving in.</span>
            </label>
            <p v-if="errors.chargesComplete" class="-mt-3 text-xs text-rose-700">{{ errors.chargesComplete }}</p>
          </div>

          <!-- Step 5 -->
          <div v-else-if="step === 4" class="mt-6 grid gap-5">
            <label
              for="lp-photos"
              class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-mist-300 bg-mist-50 px-6 py-10 text-center hover:border-brand-400 hover:bg-brand-50/40"
            >
              <ImagePlus class="size-8 text-mist-400" />
              <span class="mt-3 text-sm font-semibold text-mist-900">Add photos</span>
              <span class="mt-1 text-xs text-mist-500">JPG or PNG, landscape works best. Up to 20 photos. Start with the best one.</span>
              <input id="lp-photos" type="file" accept="image/*" multiple class="sr-only" @change="onFiles" />
            </label>
            <p v-if="errors.photos" class="-mt-2 text-xs text-rose-700">{{ errors.photos }}</p>
            <ul v-if="form.photos.length" class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <li v-for="(p, i) in form.photos" :key="p.url" class="group relative aspect-[4/3] overflow-hidden rounded-lg bg-mist-100 ring-2" :class="i === form.coverIndex ? 'ring-brand-500' : 'ring-transparent'">
                <img :src="p.url" :alt="p.name" class="size-full object-cover" />
                <span v-if="i === form.coverIndex" class="absolute left-2 top-2 rounded bg-brand-700 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">Main photo</span>
                <div class="absolute bottom-2 right-2 flex gap-1">
                  <button v-if="i !== form.coverIndex" type="button" class="grid size-7 place-items-center rounded-md bg-white/95 text-mist-700 shadow" aria-label="Set as main photo" @click="form.coverIndex = i"><Star class="size-3.5" /></button>
                  <button type="button" class="grid size-7 place-items-center rounded-md bg-white/95 text-rose-600 shadow" aria-label="Remove photo" @click="removePhoto(i)"><Trash2 class="size-3.5" /></button>
                </div>
              </li>
            </ul>
            <div>
              <label for="lp-video" class="field-label">Video tour link <span class="font-normal text-mist-400">(optional)</span></label>
              <div class="relative">
                <Video class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist-400" />
                <input id="lp-video" v-model="form.videoUrl" type="url" class="field pl-9" placeholder="YouTube, Instagram or Google Drive link" />
              </div>
            </div>
          </div>

          <!-- Step 6 -->
          <div v-else-if="step === 5" class="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label for="lp-agent" class="field-label">Contact name</label>
              <input id="lp-agent" v-model="form.agentName" class="field" autocomplete="name" :aria-invalid="!!errors.agentName" />
              <p v-if="errors.agentName" class="mt-1 text-xs text-rose-700">{{ errors.agentName }}</p>
            </div>
            <div>
              <label for="lp-email" class="field-label">Email</label>
              <input id="lp-email" v-model="form.agentEmail" type="email" class="field" autocomplete="email" />
            </div>
            <div>
              <label for="lp-phone" class="field-label">Phone number</label>
              <input id="lp-phone" v-model="form.agentPhone" type="tel" class="field" placeholder="0803 123 4567" autocomplete="tel" :aria-invalid="!!errors.agentPhone" />
              <p v-if="errors.agentPhone" class="mt-1 text-xs text-rose-700">{{ errors.agentPhone }}</p>
            </div>
            <div>
              <label for="lp-wa" class="field-label">WhatsApp number <span class="font-normal text-mist-400">(if different)</span></label>
              <input id="lp-wa" v-model="form.agentWhatsApp" type="tel" class="field" placeholder="0803 123 4567" />
            </div>
            <div class="sm:col-span-2">
              <label for="lp-avail" class="field-label">Availability status</label>
              <select id="lp-avail" v-model="form.availability" class="field">
                <option value="available">Available now</option>
                <option value="inspection_ongoing">Available, inspections ongoing</option>
              </select>
            </div>
            <label class="flex cursor-pointer items-start gap-3 text-sm text-mist-800 sm:col-span-2">
              <input v-model="form.confirmNow" type="checkbox" class="checkbox mt-0.5" />
              <span>I confirm this property is available to rent today. I’ll re-confirm every 7 days, or the listing will be marked “Awaiting confirmation” and then hidden.</span>
            </label>
            <p v-if="errors.confirmNow" class="-mt-3 text-xs text-rose-700 sm:col-span-2">{{ errors.confirmNow }}</p>
          </div>

          <!-- Step 7 -->
          <div v-else class="mt-6">
            <div class="overflow-hidden rounded-xl border border-mist-200">
              <div class="aspect-[16/7] bg-mist-100">
                <img v-if="form.photos[form.coverIndex]" :src="form.photos[form.coverIndex]!.url" alt="Main photo" class="size-full object-cover" />
              </div>
              <div class="p-5">
                <StatusBadge :status="form.availability === 'available' ? 'available' : 'inspection_ongoing'" />
                <p class="mt-3 font-display text-2xl font-extrabold text-mist-950 tabular">
                  {{ formatNaira(num(form.rent)) }} <span class="text-sm font-semibold text-mist-500">/ {{ form.period }}</span>
                </p>
                <h3 class="text-lg font-bold">{{ form.title }}</h3>
                <p class="text-sm text-mist-600">{{ previewLocation }}</p>
                <p class="mt-2 text-sm text-mist-700">{{ form.bedrooms }} bedrooms · {{ form.bathrooms }} bathrooms · {{ form.toilets }} toilets · {{ propertyTypes.find((t) => t.slug === form.type)?.name }}</p>
                <p class="mt-4 whitespace-pre-line text-sm leading-6 text-mist-700">{{ form.description }}</p>
                <dl class="mt-5 grid gap-2 border-t border-mist-100 pt-4 text-sm sm:grid-cols-2">
                  <div class="flex justify-between"><dt class="text-mist-600">Photos</dt><dd class="font-semibold">{{ form.photos.length }}</dd></div>
                  <div class="flex justify-between"><dt class="text-mist-600">Amenities</dt><dd class="font-semibold">{{ form.amenities.length }}</dd></div>
                  <div class="flex justify-between"><dt class="text-mist-600">Move-in total</dt><dd class="font-semibold tabular">{{ formatNaira(totalUpfront) }}</dd></div>
                  <div class="flex justify-between"><dt class="text-mist-600">Contact</dt><dd class="font-semibold">{{ form.agentName }}</dd></div>
                </dl>
              </div>
            </div>
            <p class="mt-4 text-sm text-mist-600">After you submit, the listing is <strong class="font-semibold text-mist-900">pending review</strong>. Our team checks it and either publishes it or tells you what to change.</p>
            <DemoNotice class="mt-4" />
          </div>

          <div class="mt-8 flex items-center justify-between border-t border-mist-100 pt-5">
            <button v-if="step > 0" type="button" class="btn btn-ghost" @click="back"><ChevronLeft class="size-4" /> Back</button>
            <span v-else />
            <button type="submit" class="btn btn-primary">
              <template v-if="step === steps.length - 1">Submit for review</template>
              <template v-else>Continue <ChevronRight class="size-4" /></template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
