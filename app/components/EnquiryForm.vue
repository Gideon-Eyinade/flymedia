<script setup lang="ts">
import type { Listing, Agent } from '~/types'

const props = defineProps<{ listing: Listing; agent: Agent; idPrefix: string }>()
const { show } = useToast()

const mode = ref<'enquiry' | 'inspection'>('enquiry')
const sent = ref(false)
const form = reactive({
  name: '',
  phone: '',
  email: '',
  date: '',
  slot: 'morning',
  message: `Hello, I’m interested in the ${props.listing.title.toLowerCase()} in ${props.listing.neighbourhood} (${props.listing.id}). Is it still available?`,
})
const errors = reactive<Record<string, string>>({})

const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
})

function validate() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (form.name.trim().length < 2) errors.name = 'Enter your full name.'
  const digits = form.phone.replace(/\D/g, '')
  if (!/^(0\d{10}|234\d{10})$/.test(digits)) errors.phone = 'Enter a Nigerian phone number, e.g. 0803 123 4567.'
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address, or leave it blank.'
  if (mode.value === 'inspection' && !form.date) errors.date = 'Choose a preferred inspection date.'
  if (form.message.trim().length < 10) errors.message = 'Add a short message for the agent.'
  return Object.keys(errors).length === 0
}

function submit() {
  if (!validate()) return
  sent.value = true
  show(mode.value === 'inspection' ? `Inspection request sent to ${props.agent.name}.` : `Enquiry sent to ${props.agent.name}.`, 'success')
}

function reset() {
  sent.value = false
}
</script>

<template>
  <div>
    <div class="mb-4 flex gap-1 rounded-lg bg-mist-100 p-1" role="tablist">
      <button
        v-for="m in [{ v: 'enquiry', l: 'Send enquiry' }, { v: 'inspection', l: 'Request inspection' }] as const"
        :key="m.v"
        type="button"
        role="tab"
        :aria-selected="mode === m.v"
        class="h-9 flex-1 rounded-md text-sm font-semibold transition-colors"
        :class="mode === m.v ? 'bg-white text-mist-950 shadow-sm ring-1 ring-mist-200' : 'text-mist-600 hover:text-mist-900'"
        @click="mode = m.v; sent = false"
      >
        {{ m.l }}
      </button>
    </div>

    <div v-if="sent" class="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-inset ring-emerald-600/20">
      <p class="font-semibold">{{ mode === 'inspection' ? 'Inspection request sent' : 'Enquiry sent' }}</p>
      <p class="mt-1 leading-6">
        {{ agent.name }} will contact you on {{ form.phone }}. {{ agent.responseTime }}.
      </p>
      <button type="button" class="mt-3 font-semibold text-emerald-800 underline underline-offset-2" @click="reset">Send another message</button>
    </div>

    <form v-else class="grid gap-3" novalidate @submit.prevent="submit">
      <div>
        <label :for="`${idPrefix}-name`" class="field-label">Full name</label>
        <input :id="`${idPrefix}-name`" v-model="form.name" type="text" autocomplete="name" class="field" :aria-invalid="!!errors.name" />
        <p v-if="errors.name" class="mt-1 text-xs text-rose-700">{{ errors.name }}</p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div>
          <label :for="`${idPrefix}-phone`" class="field-label">Phone number</label>
          <input :id="`${idPrefix}-phone`" v-model="form.phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="0803 123 4567" class="field" :aria-invalid="!!errors.phone" />
          <p v-if="errors.phone" class="mt-1 text-xs text-rose-700">{{ errors.phone }}</p>
        </div>
        <div>
          <label :for="`${idPrefix}-email`" class="field-label">Email <span class="font-normal text-mist-400">(optional)</span></label>
          <input :id="`${idPrefix}-email`" v-model="form.email" type="email" autocomplete="email" class="field" :aria-invalid="!!errors.email" />
          <p v-if="errors.email" class="mt-1 text-xs text-rose-700">{{ errors.email }}</p>
        </div>
      </div>
      <div v-if="mode === 'inspection'" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div>
          <label :for="`${idPrefix}-date`" class="field-label">Preferred date</label>
          <input :id="`${idPrefix}-date`" v-model="form.date" type="date" :min="minDate" class="field" :aria-invalid="!!errors.date" />
          <p v-if="errors.date" class="mt-1 text-xs text-rose-700">{{ errors.date }}</p>
        </div>
        <div>
          <label :for="`${idPrefix}-slot`" class="field-label">Time</label>
          <select :id="`${idPrefix}-slot`" v-model="form.slot" class="field">
            <option value="morning">Morning (9am–12pm)</option>
            <option value="afternoon">Afternoon (12pm–3pm)</option>
            <option value="evening">Late afternoon (3pm–6pm)</option>
          </select>
        </div>
      </div>
      <div>
        <label :for="`${idPrefix}-message`" class="field-label">Message</label>
        <textarea :id="`${idPrefix}-message`" v-model="form.message" rows="4" class="field" :aria-invalid="!!errors.message" />
        <p v-if="errors.message" class="mt-1 text-xs text-rose-700">{{ errors.message }}</p>
      </div>
      <button type="submit" class="btn btn-primary w-full">
        {{ mode === 'inspection' ? 'Request inspection' : 'Send enquiry' }}
      </button>
      <p class="text-xs leading-5 text-mist-500">
        Never pay rent or fees before you have inspected the property and seen the tenancy agreement.
      </p>
    </form>
  </div>
</template>
