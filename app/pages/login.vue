<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'

definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Log in', robots: 'noindex' })

const { show } = useToast()
const email = ref('')
const password = ref('')
const reveal = ref(false)
const errors = reactive<Record<string, string>>({})

function submit() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) errors.email = 'Enter the email you signed up with.'
  if (!password.value) errors.password = 'Enter your password.'
  if (Object.keys(errors).length) return
  show('Sign-in will work once accounts are connected. This is a preview build.')
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-extrabold">Welcome back</h1>
    <p class="mt-2 text-mist-600">Log in to see saved homes, enquiries and inspection requests.</p>

    <form class="mt-8 grid gap-4" novalidate @submit.prevent="submit">
      <div>
        <label for="login-email" class="field-label">Email</label>
        <input id="login-email" v-model="email" type="email" autocomplete="email" class="field" :aria-invalid="!!errors.email" />
        <p v-if="errors.email" class="mt-1 text-xs text-rose-700">{{ errors.email }}</p>
      </div>
      <div>
        <div class="flex items-center justify-between">
          <label for="login-password" class="field-label">Password</label>
          <NuxtLink to="/forgot-password" class="mb-1.5 text-[13px] font-semibold text-brand-700 hover:text-brand-800">Forgot password?</NuxtLink>
        </div>
        <div class="relative">
          <input id="login-password" v-model="password" :type="reveal ? 'text' : 'password'" autocomplete="current-password" class="field pr-11" :aria-invalid="!!errors.password" />
          <button type="button" class="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center text-mist-500 hover:text-mist-800" :aria-label="reveal ? 'Hide password' : 'Show password'" @click="reveal = !reveal">
            <component :is="reveal ? EyeOff : Eye" class="size-4" />
          </button>
        </div>
        <p v-if="errors.password" class="mt-1 text-xs text-rose-700">{{ errors.password }}</p>
      </div>
      <button type="submit" class="btn btn-primary mt-2">Log in</button>
    </form>
    <p class="mt-6 text-sm text-mist-600">
      New to Flymedia? <NuxtLink to="/signup" class="font-semibold text-brand-700 hover:text-brand-800">Create an account</NuxtLink>
    </p>
    <DemoNotice class="mt-8" text="Preview build: accounts are not connected yet. Saved homes are kept on this device in the meantime." />
  </div>
</template>
