<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

withDefaults(defineProps<{ itemClass?: string; label: string }>(), {
  itemClass: 'w-[82%] sm:w-[46%] lg:w-[calc((100%-3*1.25rem)/4)]',
})

const track = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)

function update() {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft <= 4
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
}

function scroll(dir: 1 | -1) {
  const el = track.value
  if (!el) return
  el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
}

onMounted(update)
</script>

<template>
  <div class="relative">
    <div
      ref="track"
      class="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-2 sm:mx-0 sm:scroll-px-0 sm:px-0"
      role="region"
      :aria-label="label"
      tabindex="0"
      @scroll.passive="update"
    >
      <slot :item-class="`${itemClass} shrink-0 snap-start`" />
    </div>
    <button
      type="button"
      class="absolute -left-4 top-[38%] hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-mist-200 bg-white text-mist-800 shadow-[var(--shadow-lift)] transition-opacity hover:bg-mist-50 disabled:opacity-0 lg:grid"
      :disabled="atStart"
      aria-label="Scroll left"
      @click="scroll(-1)"
    >
      <ChevronLeft class="size-5" />
    </button>
    <button
      type="button"
      class="absolute -right-4 top-[38%] hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-mist-200 bg-white text-mist-800 shadow-[var(--shadow-lift)] transition-opacity hover:bg-mist-50 disabled:opacity-0 lg:grid"
      :disabled="atEnd"
      aria-label="Scroll right"
      @click="scroll(1)"
    >
      <ChevronRight class="size-5" />
    </button>
  </div>
</template>
