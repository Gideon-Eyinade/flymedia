<script setup lang="ts">
import { Flag, X } from 'lucide-vue-next'

const props = defineProps<{ listingId: string }>()
const { show } = useToast()
const open = ref(false)
const reason = ref('')
const details = ref('')
const error = ref('')

const reasons = [
  { v: 'rented', l: 'It has already been rented' },
  { v: 'price', l: 'The price or fees are different' },
  { v: 'photos', l: 'Photos don’t match the property' },
  { v: 'fraud', l: 'I think it’s a scam' },
  { v: 'agent', l: 'The agent asked for money before inspection' },
  { v: 'other', l: 'Something else' },
]

function submit() {
  if (!reason.value) {
    error.value = 'Choose a reason.'
    return
  }
  open.value = false
  reason.value = ''
  details.value = ''
  error.value = ''
  show(`Thanks. Our team will review listing ${props.listingId} within 24 hours.`, 'success')
}

watch(open, (v) => {
  if (import.meta.client) document.documentElement.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <button type="button" class="inline-flex items-center gap-1.5 text-sm font-medium text-mist-600 hover:text-rose-700" @click="open = true">
    <Flag class="size-4" /> Report this listing
  </button>
  <Teleport to="body">
    <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-150" leave-to-class="opacity-0">
      <div v-if="open" class="fixed inset-0 z-[70] grid place-items-end bg-mist-950/50 p-0 sm:place-items-center sm:p-4" @click.self="open = false">
        <form class="w-full max-w-md rounded-t-2xl bg-white p-6 sm:rounded-2xl" role="dialog" aria-modal="true" aria-labelledby="report-title" @submit.prevent="submit">
          <div class="flex items-start justify-between">
            <h2 id="report-title" class="text-lg font-bold">Report this listing</h2>
            <button type="button" class="-mr-2 -mt-1 grid size-9 place-items-center rounded-lg text-mist-500 hover:bg-mist-100" aria-label="Close" @click="open = false"><X class="size-5" /></button>
          </div>
          <p class="mt-1 text-sm text-mist-600">Reports about rented homes trigger an immediate availability check with the agent.</p>
          <fieldset class="mt-4 grid gap-2">
            <legend class="sr-only">Reason</legend>
            <label v-for="r in reasons" :key="r.v" class="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm" :class="reason === r.v ? 'border-brand-500 bg-brand-50' : 'border-mist-200 hover:border-mist-300'">
              <input v-model="reason" type="radio" name="report-reason" :value="r.v" class="size-4 accent-brand-700" />
              {{ r.l }}
            </label>
          </fieldset>
          <p v-if="error" class="mt-2 text-xs text-rose-700">{{ error }}</p>
          <label for="report-details" class="field-label mt-4">Details <span class="font-normal text-mist-400">(optional)</span></label>
          <textarea id="report-details" v-model="details" rows="3" class="field" />
          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="btn btn-secondary" @click="open = false">Cancel</button>
            <button type="submit" class="btn btn-primary">Send report</button>
          </div>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>
