<script setup lang="ts">
import { Search, Building2, Check } from 'lucide-vue-next'

definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Create an account', robots: 'noindex' })

const route = useRoute()
const { show } = useToast()
const role = ref<'seeker' | 'agent'>(route.query.role === 'agent' ? 'agent' : 'seeker')
const form = reactive({ name: '', email: '', phone: '', agency: '', password: '', terms: false })
const errors = reactive<Record<string, string>>({})

function submit() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (form.name.trim().length < 2) errors.name = 'Enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!/^(0\d{10}|234\d{10})$/.test(form.phone.replace(/\D/g, ''))) errors.phone = 'Enter a Nigerian phone number.'
  if (form.password.length < 8) errors.password = 'Use at least 8 characters.'
  if (!form.terms) errors.terms = 'Accept the terms to continue.'
  if (Object.keys(errors).length) return
  show('Account creation will work once accounts are connected. This is a preview build.')
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-extrabold">Create your account</h1>
    <p class="mt-2 text-mist-600">Choose how you’ll use Flymedia.</p>

    <div class="mt-6 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Account type">
      <button
        v-for="r in [{ v: 'seeker', l: 'I’m looking for a home', d: 'Save homes, enquire and book inspections', icon: Search }, { v: 'agent', l: 'I’m an agent or landlord', d: 'List properties and manage enquiries', icon: Building2 }] as const"
        :key="r.v"
        type="button"
        role="radio"
        :aria-checked="role === r.v"
        class="relative rounded-xl border p-4 text-left transition-colors"
        :class="role === r.v ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : 'border-mist-200 hover:border-mist-300'"
        @click="role = r.v"
      >
        <component :is="r.icon" class="size-5" :class="role === r.v ? 'text-brand-700' : 'text-mist-500'" />
        <span class="mt-3 block text-sm font-bold text-mist-950">{{ r.l }}</span>
        <span class="mt-0.5 block text-xs leading-5 text-mist-600">{{ r.d }}</span>
        <span v-if="role === r.v" class="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-brand-700 text-white"><Check class="size-3" /></span>
      </button>
    </div>

    <form class="mt-6 grid gap-4" novalidate @submit.prevent="submit">
      <div>
        <label for="su-name" class="field-label">Full name</label>
        <input id="su-name" v-model="form.name" class="field" autocomplete="name" :aria-invalid="!!errors.name" />
        <p v-if="errors.name" class="mt-1 text-xs text-rose-700">{{ errors.name }}</p>
      </div>
      <div v-if="role === 'agent'">
        <label for="su-agency" class="field-label">Agency or business name <span class="font-normal text-mist-400">(optional)</span></label>
        <input id="su-agency" v-model="form.agency" class="field" autocomplete="organization" />
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="su-email" class="field-label">Email</label>
          <input id="su-email" v-model="form.email" type="email" class="field" autocomplete="email" :aria-invalid="!!errors.email" />
          <p v-if="errors.email" class="mt-1 text-xs text-rose-700">{{ errors.email }}</p>
        </div>
        <div>
          <label for="su-phone" class="field-label">Phone number</label>
          <input id="su-phone" v-model="form.phone" type="tel" class="field" autocomplete="tel" placeholder="0803 123 4567" :aria-invalid="!!errors.phone" />
          <p v-if="errors.phone" class="mt-1 text-xs text-rose-700">{{ errors.phone }}</p>
        </div>
      </div>
      <div>
        <label for="su-password" class="field-label">Password</label>
        <input id="su-password" v-model="form.password" type="password" class="field" autocomplete="new-password" :aria-invalid="!!errors.password" />
        <p v-if="errors.password" class="mt-1 text-xs text-rose-700">{{ errors.password }}</p>
        <p v-else class="mt-1 text-xs text-mist-500">At least 8 characters.</p>
      </div>
      <label class="flex cursor-pointer items-start gap-2.5 text-sm text-mist-700">
        <input v-model="form.terms" type="checkbox" class="checkbox mt-0.5" />
        <span>I agree to the <NuxtLink to="/terms" class="font-semibold text-brand-700">terms</NuxtLink> and <NuxtLink to="/privacy" class="font-semibold text-brand-700">privacy policy</NuxtLink>.</span>
      </label>
      <p v-if="errors.terms" class="-mt-2 text-xs text-rose-700">{{ errors.terms }}</p>
      <button type="submit" class="btn btn-primary mt-1">{{ role === 'agent' ? 'Create agent account' : 'Create account' }}</button>
    </form>
    <p class="mt-6 text-sm text-mist-600">Already have an account? <NuxtLink to="/login" class="font-semibold text-brand-700">Log in</NuxtLink></p>
    <DemoNotice class="mt-8" text="Preview build: accounts are not connected yet. We’ll verify your email address once sign-up is live." />
  </div>
</template>
