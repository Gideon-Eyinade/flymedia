<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const is404 = computed(() => props.error.statusCode === 404)

useSeoMeta({ title: is404.value ? 'Page not found' : 'Something went wrong', robots: 'noindex' })

function home() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <NuxtLayout>
    <div class="container-page grid min-h-[60vh] place-items-center py-16 text-center">
      <div class="max-w-md">
        <p class="font-display text-6xl font-extrabold text-brand-700 tabular">{{ error.statusCode }}</p>
        <h1 class="mt-4 text-2xl font-extrabold">{{ is404 ? (error.statusMessage && error.statusMessage !== 'Page Not Found' ? error.statusMessage : 'We couldn’t find that page') : 'Something went wrong' }}</h1>
        <p class="mt-2 text-mist-600">
          {{ is404 ? 'The listing may have been removed, or the link may be wrong.' : 'Please try again in a moment.' }}
        </p>
        <div class="mt-6 flex justify-center gap-2">
          <button type="button" class="btn btn-secondary" @click="home">Go home</button>
          <button type="button" class="btn btn-primary" @click="clearError({ redirect: '/apartments' })">Browse apartments</button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
