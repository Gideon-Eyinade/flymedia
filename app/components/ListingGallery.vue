<script setup lang="ts">
import { ChevronLeft, ChevronRight, Expand, X, Images, PlayCircle } from 'lucide-vue-next'

const props = defineProps<{ images: string[]; title: string; hasVideoTour?: boolean }>()
const { show } = useToast()

const current = ref(0)
const lightbox = ref(false)

function go(delta: number) {
  current.value = (current.value + delta + props.images.length) % props.images.length
}

function open(i: number) {
  current.value = i
  lightbox.value = true
}

function onKey(e: KeyboardEvent) {
  if (!lightbox.value) return
  if (e.key === 'Escape') lightbox.value = false
  if (e.key === 'ArrowRight') go(1)
  if (e.key === 'ArrowLeft') go(-1)
}

watch(lightbox, (v) => {
  if (import.meta.client) document.documentElement.style.overflow = v ? 'hidden' : ''
})
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})

// Touch swipe on mobile
let touchX = 0
const onTouchStart = (e: TouchEvent) => (touchX = e.touches[0]?.clientX ?? 0)
const onTouchEnd = (e: TouchEvent) => {
  const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX
  if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
}

function playTour() {
  show('Video tours play here once media hosting is connected.')
}
</script>

<template>
  <div>
    <!-- Desktop mosaic -->
    <div class="hidden h-[440px] gap-2 overflow-hidden rounded-[var(--radius-card)] md:grid md:grid-cols-4 md:grid-rows-2">
      <button type="button" class="group relative col-span-2 row-span-2 overflow-hidden bg-mist-100" @click="open(0)">
        <img :src="`${images[0]}.jpg`" :alt="`${title}, photo 1`" class="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" fetchpriority="high" />
      </button>
      <button
        v-for="(img, i) in images.slice(1, 5)"
        :key="img + i"
        type="button"
        class="group relative overflow-hidden bg-mist-100"
        :class="images.length === 2 ? 'col-span-2 row-span-2' : images.length === 3 ? 'col-span-2' : ''"
        @click="open(i + 1)"
      >
        <img :src="`${img}-sm.jpg`" :alt="`${title}, photo ${i + 2}`" class="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
      </button>
      <div v-if="images.length === 4" class="bg-mist-100" />
    </div>

    <!-- Mobile slider -->
    <div class="relative -mx-4 aspect-[4/3] overflow-hidden bg-mist-100 sm:mx-0 sm:rounded-[var(--radius-card)] md:hidden" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
      <img :src="`${images[current]}.jpg`" :alt="`${title}, photo ${current + 1}`" class="size-full object-cover" @click="lightbox = true" />
      <button type="button" class="absolute left-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow" aria-label="Previous photo" @click="go(-1)"><ChevronLeft class="size-5" /></button>
      <button type="button" class="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow" aria-label="Next photo" @click="go(1)"><ChevronRight class="size-5" /></button>
      <span class="absolute bottom-3 right-3 rounded-md bg-mist-950/70 px-2 py-0.5 text-xs font-medium text-white tabular">{{ current + 1 }} / {{ images.length }}</span>
    </div>

    <div class="mt-3 flex flex-wrap gap-2">
      <button type="button" class="btn btn-secondary btn-sm" @click="open(current)">
        <Expand class="size-4" /> View all {{ images.length }} photos
      </button>
      <button v-if="hasVideoTour" type="button" class="btn btn-secondary btn-sm" @click="playTour">
        <PlayCircle class="size-4" /> Video tour
      </button>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-150" leave-to-class="opacity-0">
        <div v-if="lightbox" class="fixed inset-0 z-[70] flex flex-col bg-mist-950" role="dialog" aria-modal="true" :aria-label="`${title} photos`">
          <div class="flex items-center justify-between px-4 py-3 text-white">
            <span class="inline-flex items-center gap-2 text-sm"><Images class="size-4" /> <span class="tabular">{{ current + 1 }} / {{ images.length }}</span></span>
            <button type="button" class="grid size-10 place-items-center rounded-full hover:bg-white/10" aria-label="Close photos" @click="lightbox = false"><X class="size-5" /></button>
          </div>
          <div class="relative flex min-h-0 flex-1 items-center justify-center px-4" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
            <img :src="`${images[current]}.jpg`" :alt="`${title}, photo ${current + 1}`" class="max-h-full max-w-full rounded-lg object-contain" />
            <button type="button" class="absolute left-4 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:grid" aria-label="Previous photo" @click="go(-1)"><ChevronLeft class="size-6" /></button>
            <button type="button" class="absolute right-4 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:grid" aria-label="Next photo" @click="go(1)"><ChevronRight class="size-6" /></button>
          </div>
          <div class="no-scrollbar flex justify-center gap-2 overflow-x-auto px-4 py-4">
            <button
              v-for="(img, i) in images"
              :key="img + i"
              type="button"
              class="h-14 w-20 shrink-0 overflow-hidden rounded-md ring-2 transition"
              :class="i === current ? 'ring-white' : 'opacity-60 ring-transparent hover:opacity-100'"
              :aria-label="`Show photo ${i + 1}`"
              @click="current = i"
            >
              <img :src="`${img}-sm.jpg`" alt="" class="size-full object-cover" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
