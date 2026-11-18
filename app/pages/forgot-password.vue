<script setup lang="ts">
definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Reset your password', robots: 'noindex' })

const email = ref('')
const error = ref('')
const sent = ref(false)

function submit() {
  error.value = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? '' : 'Enter the email you signed up with.'
  if (!error.value) sent.value = true
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-extrabold">Reset your password</h1>
    <template v-if="!sent">
      <p class="mt-2 text-mist-600">Enter your email and we’ll send you a link to choose a new password.</p>
      <form class="mt-8 grid gap-4" novalidate @submit.prevent="submit">
        <div>
          <label for="fp-email" class="field-label">Email</label>
          <input id="fp-email" v-model="email" type="email" autocomplete="email" class="field" :aria-invalid="!!error" />
          <p v-if="error" class="mt-1 text-xs text-rose-700">{{ error }}</p>
        </div>
        <button type="submit" class="btn btn-primary">Send reset link</button>
      </form>
    </template>
    <template v-else>
      <p class="mt-2 text-mist-600">If an account exists for <strong class="text-mist-900">{{ email }}</strong>, you’ll get an email with a reset link in a few minutes.</p>
      <DemoNotice class="mt-6" text="Preview build: no email was sent. Password reset will work once accounts are connected." />
    </template>
    <p class="mt-6 text-sm text-mist-600"><NuxtLink to="/login" class="font-semibold text-brand-700">Back to log in</NuxtLink></p>
  </div>
</template>
