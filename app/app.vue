<script setup lang="ts">
// Site-wide defaults for link previews. Pages override any of these with their own useSeoMeta().
const route = useRoute()
const abs = useSiteUrl()
const pageUrl = computed(() => abs(route.path))

useSeoMeta({
  description: 'Find apartments that are genuinely available for rent in Nigeria. See the full move-in cost and contact verified agents.',
  ogType: 'website',
  ogUrl: pageUrl,
  ogImage: abs('/images/house-10.jpg'),
  ogImageWidth: 1200,
  ogImageHeight: 800,
  ogImageType: 'image/jpeg',
  ogImageAlt: 'An apartment building listed on Flymedia',
  twitterCard: 'summary_large_image',
})
useHead({ link: [{ rel: 'canonical', href: pageUrl }] })
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
