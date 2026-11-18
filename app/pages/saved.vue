<script setup lang="ts">
import { Heart } from 'lucide-vue-next'
import { listings } from '~/data/listings'

useSeoMeta({ title: 'Saved homes', robots: 'noindex' })

const { saved } = useSaved()
const items = computed(() => saved.value.map((id) => listings.find((l) => l.id === id)).filter((l) => !!l))
const noLongerAvailable = computed(() => items.value.filter((l) => !isDiscoverable(l)).length)
</script>

<template>
  <div class="container-page py-10">
    <Breadcrumbs :items="[{ label: 'Home', to: '/' }, { label: 'Saved homes' }]" />
    <h1 class="mt-3 text-3xl font-extrabold">Saved homes</h1>
    <p class="mt-2 text-[15px] text-mist-600">
      Saved on this device. Create an account to keep them across devices and get alerts when a saved home changes status.
    </p>

    <ClientOnly>
      <p v-if="noLongerAvailable" class="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-inset ring-amber-600/20">
        {{ plural(noLongerAvailable, 'saved home') }} {{ noLongerAvailable === 1 ? 'is' : 'are' }} no longer available.
      </p>
      <div v-if="items.length" class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ListingCard v-for="l in items" :key="l.id" :listing="l" />
      </div>
      <div v-else class="mt-8">
        <EmptyState title="No saved homes yet" body="Tap the heart on any apartment to save it here and compare later.">
          <template #icon><Heart class="size-5" /></template>
          <NuxtLink to="/apartments" class="btn btn-primary">Find apartments</NuxtLink>
        </EmptyState>
      </div>
      <template #fallback>
        <div class="mt-8 h-64 animate-pulse rounded-[var(--radius-card)] bg-mist-100" />
      </template>
    </ClientOnly>
  </div>
</template>
