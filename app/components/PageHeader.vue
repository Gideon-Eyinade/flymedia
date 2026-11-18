<script setup lang="ts">
defineProps<{ title: string; intro?: string; crumb: string; eyebrow?: string }>()
</script>

<template>
  <section class="border-b border-mist-200 bg-mist-50">
    <div class="container-page py-10 sm:py-12">
      <Breadcrumbs :items="[{ label: 'Home', to: '/' }, { label: crumb }]" />
      <p v-if="eyebrow" class="eyebrow mt-5">{{ eyebrow }}</p>
      <h1 class="mt-3 max-w-3xl text-3xl font-extrabold sm:text-4xl">{{ title }}</h1>
      <p v-if="intro" class="mt-3 max-w-2xl text-[15px] leading-7 text-mist-600">{{ intro }}</p>
      <slot />
    </div>
  </section>
</template>
