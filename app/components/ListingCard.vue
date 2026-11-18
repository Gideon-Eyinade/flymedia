<script setup lang="ts">
import { BedDouble, Bath, MapPin, Images, ShieldCheck, Clock3, Toilet, Video } from 'lucide-vue-next'
import type { Listing } from '~/types'
import { findArea } from '~/data/locations'
import { findType } from '~/data/catalog'

const props = withDefaults(defineProps<{ listing: Listing; variant?: 'grid' | 'list'; showFeatured?: boolean }>(), {
  variant: 'grid',
  showFeatured: true,
})

const area = computed(() => findArea(props.listing.area))
const type = computed(() => findType(props.listing.type))
const status = computed(() => effectiveStatus(props.listing))
const to = computed(() => `/apartments/${props.listing.slug}`)
const cover = computed(() => `${props.listing.images[0]}-sm.jpg`)
const location = computed(() => [props.listing.neighbourhood, area.value?.name, area.value?.cityName].filter((v, i, arr) => v && arr.indexOf(v) === i).join(', '))
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-[var(--radius-card)] border border-mist-200 bg-white transition-shadow duration-200 hover:shadow-[var(--shadow-lift)]"
    :class="variant === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col'"
  >
    <NuxtLink
      :to="to"
      class="relative block shrink-0 overflow-hidden bg-mist-100"
      :class="variant === 'list' ? 'aspect-[4/3] sm:aspect-auto sm:w-[300px]' : 'aspect-[4/3]'"
      tabindex="-1"
      aria-hidden="true"
    >
      <img
        :src="cover"
        :alt="`${listing.title} in ${location}`"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
        decoding="async"
        width="640"
        height="427"
      />
      <div class="absolute left-3 top-3 flex flex-wrap gap-1.5">
        <span
          v-if="showFeatured && listing.featured"
          class="rounded-full bg-sun-400 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-mist-950"
        >Featured</span>
        <VerifiedBadge v-if="listing.verified" tone="solid" />
      </div>
      <div class="absolute bottom-3 left-3 flex gap-1.5">
        <span class="inline-flex items-center gap-1 rounded-md bg-mist-950/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
          <Images class="size-3" /> {{ listing.images.length }}
        </span>
        <span v-if="listing.hasVideoTour" class="inline-flex items-center gap-1 rounded-md bg-mist-950/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
          <Video class="size-3" /> Tour
        </span>
      </div>
    </NuxtLink>

    <div class="absolute right-3 top-3 z-10">
      <SaveButton :listing-id="listing.id" />
    </div>

    <div class="flex min-w-0 flex-1 flex-col p-4">
      <div class="flex items-start justify-between gap-2">
        <StatusBadge :status="status" />
        <span class="text-[11px] text-mist-500">Listed {{ daysAgoText(listing.postedDaysAgo) }}</span>
      </div>

      <p class="mt-3 font-display text-lg font-extrabold tracking-tight text-mist-950 tabular">
        {{ formatNaira(listing.rent) }}
        <span class="text-sm font-semibold text-mist-500">/ {{ periodLabel(listing.period) }}</span>
      </p>

      <h3 class="mt-0.5 text-[15px] font-semibold leading-snug text-mist-900">
        <NuxtLink :to="to" class="after:absolute after:inset-0 after:content-[''] hover:text-brand-700 focus:outline-none">
          {{ listing.title }}
        </NuxtLink>
      </h3>
      <p class="mt-1 flex items-center gap-1 text-sm text-mist-600">
        <MapPin class="size-3.5 shrink-0 text-mist-400" />
        <span class="truncate">{{ location }}</span>
      </p>

      <ul class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-mist-700">
        <li class="inline-flex items-center gap-1"><BedDouble class="size-4 text-mist-400" /> {{ plural(listing.bedrooms, 'Bed') }}</li>
        <li class="inline-flex items-center gap-1"><Bath class="size-4 text-mist-400" /> {{ plural(listing.bathrooms, 'Bath') }}</li>
        <li v-if="variant === 'list'" class="inline-flex items-center gap-1"><Toilet class="size-4 text-mist-400" /> {{ plural(listing.toilets, 'Toilet') }}</li>
        <li class="rounded bg-mist-100 px-1.5 py-0.5 text-xs font-medium text-mist-700">{{ type?.short }}</li>
      </ul>

      <p v-if="variant === 'list'" class="mt-3 line-clamp-2 text-sm leading-6 text-mist-600">{{ listing.description[0] }}</p>

      <div class="mt-auto flex items-center gap-1.5 border-t border-mist-100 pt-3 text-xs text-mist-600" :class="variant === 'list' ? 'mt-4' : 'mt-4'">
        <component :is="status === 'available' ? ShieldCheck : Clock3" class="size-3.5" :class="status === 'available' ? 'text-emerald-600' : 'text-amber-600'" />
        <span>Availability confirmed <strong class="font-semibold text-mist-800">{{ daysAgoText(listing.confirmedDaysAgo) }}</strong></span>
      </div>
    </div>
  </article>
</template>
