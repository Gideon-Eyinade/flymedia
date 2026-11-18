<script setup lang="ts">
import { CircleCheck, Info, X } from 'lucide-vue-next'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4" aria-live="polite">
    <TransitionGroup
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl bg-mist-950 px-4 py-3 text-sm text-white shadow-xl"
        role="status"
      >
        <component :is="t.tone === 'error' ? Info : CircleCheck" class="mt-0.5 size-4 shrink-0" :class="t.tone === 'error' ? 'text-rose-300' : 'text-emerald-400'" />
        <p class="flex-1 leading-5">{{ t.message }}</p>
        <button type="button" class="text-mist-400 hover:text-white" aria-label="Dismiss" @click="dismiss(t.id)">
          <X class="size-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
