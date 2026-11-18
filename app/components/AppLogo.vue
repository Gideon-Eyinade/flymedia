<script setup lang="ts">
withDefaults(defineProps<{ inverted?: boolean }>(), { inverted: false })
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <img
      src="/logo.png"
      alt=""
      width="40"
      height="40"
      class="size-10 shrink-0 rounded-full"
      :class="inverted && 'ring-1 ring-white/15'"
    />
    <span
      class="font-display text-[1.3rem] font-extrabold uppercase leading-none tracking-[0.02em]"
      :class="inverted ? 'text-white' : 'text-mist-950'"
    >Fly<span class="text-brand-600">me</span>dia</span>
  </span>
</template>
