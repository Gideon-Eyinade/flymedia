<script setup lang="ts">
import { Info } from 'lucide-vue-next'

withDefaults(defineProps<{ text?: string }>(), {
  text: 'Preview build: this form works in your browser but is not sent anywhere yet. Accounts and messaging arrive with the backend.',
})
</script>

<template>
  <p class="flex items-start gap-2 rounded-lg bg-sun-50 px-3 py-2.5 text-xs leading-5 text-sun-700 ring-1 ring-inset ring-sun-200">
    <Info class="mt-0.5 size-3.5 shrink-0" />
    <span>{{ text }}</span>
  </p>
</template>
