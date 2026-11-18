<script setup lang="ts">
import {
  MapPin, BedDouble, Bath, Toilet, Ruler, Sofa, Sparkles, Hammer, Building2, Phone, MessageCircle, Share2,
  ShieldCheck, Clock3, CalendarClock, UserRound, Star, Check, Eye, Heart, BadgeCheck, Info,
} from 'lucide-vue-next'
import { findListing, listings } from '~/data/listings'
import { findAgent } from '~/data/agents'
import { findArea } from '~/data/locations'
import { findType, amenities as allAmenities } from '~/data/catalog'
import { platformSettings } from '~/data/settings'

const route = useRoute()
const listing = findListing(String(route.params.slug))
if (!listing) {
  throw createError({ statusCode: 404, statusMessage: 'This apartment could not be found', fatal: true })
}
const agent = findAgent(listing.agentId)!
const area = findArea(listing.area)!
const type = findType(listing.type)!
const status = effectiveStatus(listing)
const meta = statusMeta[status]
const isOpen = isDiscoverable(listing)
const { show } = useToast()

const fullLocation = [listing.neighbourhood, area.name, area.cityName, area.stateName]
  .filter((v, i, arr) => v && arr.indexOf(v) === i)
  .join(', ')

const title = `${listing.title} for rent in ${listing.neighbourhood}, ${area.name}`
const priceText = `${formatNaira(listing.rent)} per ${periodLabel(listing.period)}`

const abs = useSiteUrl()
const pageUrl = abs(`/apartments/${listing.slug}`)
const coverImage = abs(`${listing.images[0]}.jpg`)
const roomsText = `${listing.bedrooms} bed · ${listing.bathrooms} bath${listing.sizeSqm ? ` · ${listing.sizeSqm} m²` : ''}`

useSeoMeta({
  title,
  description: `${listing.title} in ${fullLocation}. ${priceText}. ${listing.bedrooms} bedrooms, ${listing.bathrooms} bathrooms. ${meta.label}, last confirmed ${daysAgoText(listing.confirmedDaysAgo)}.`,
  // WhatsApp/Facebook/X previews: title + short description + large image
  ogTitle: `${listing.title} in ${listing.neighbourhood ?? area.name} · ${priceText}`,
  ogDescription: `${roomsText} · ${fullLocation}. ${meta.label}${listing.verified ? ' · Verified by Flymedia' : ''}. ${listing.description[0]}`.slice(0, 300),
  ogUrl: pageUrl,
  ogImage: coverImage,
  ogImageSecureUrl: coverImage.startsWith('https') ? coverImage : undefined,
  ogImageWidth: 1200,
  ogImageHeight: 800,
  ogImageType: 'image/jpeg',
  ogImageAlt: `${listing.title} in ${fullLocation}`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: isOpen ? undefined : 'noindex, follow',
})

useHead({
  // leave room for the fixed mobile action bar
  bodyAttrs: { class: 'max-lg:pb-[72px]' },
  link: [{ rel: 'canonical', href: pageUrl }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: title,
        url: pageUrl,
        image: listing.images.map((i) => abs(`${i}.jpg`)),
        datePosted: new Date(Date.now() - listing.postedDaysAgo * 864e5).toISOString().slice(0, 10),
        description: listing.description.join(' '),
        offers: {
          '@type': 'Offer',
          price: listing.rent,
          priceCurrency: 'NGN',
          availability: status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability',
          businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
        },
        about: {
          '@type': 'Apartment',
          numberOfRooms: listing.bedrooms,
          numberOfBathroomsTotal: listing.bathrooms,
          ...(listing.sizeSqm ? { floorSize: { '@type': 'QuantitativeValue', value: listing.sizeSqm, unitCode: 'MTK' } } : {}),
          address: { '@type': 'PostalAddress', addressLocality: area.name, addressRegion: area.stateName, addressCountry: 'NG' },
        },
      }),
    },
  ],
})

const facts = [
  { icon: BedDouble, label: 'Bedrooms', value: String(listing.bedrooms) },
  { icon: Bath, label: 'Bathrooms', value: String(listing.bathrooms) },
  { icon: Toilet, label: 'Toilets', value: String(listing.toilets) },
  { icon: Ruler, label: 'Floor area', value: listing.sizeSqm ? `${listing.sizeSqm} m²` : 'Not provided' },
  { icon: Building2, label: 'Property type', value: type.name },
  { icon: Sofa, label: 'Furnishing', value: { furnished: 'Furnished', semi_furnished: 'Semi-furnished', unfurnished: 'Unfurnished' }[listing.furnishing] },
  { icon: Sparkles, label: 'Servicing', value: listing.serviced ? 'Serviced' : 'Not serviced' },
  { icon: Hammer, label: 'Condition', value: { newly_built: 'Newly built', renovated: 'Renovated', good: 'Good', fair: 'Fair' }[listing.condition] },
]

const groupedAmenities = (['utilities', 'security', 'building', 'comfort'] as const)
  .map((g) => ({
    group: { utilities: 'Power and water', security: 'Security', building: 'Building and compound', comfort: 'Inside the home' }[g],
    items: allAmenities.filter((a) => a.group === g && listing.amenities.includes(a.id)),
  }))
  .filter((g) => g.items.length)

const similar = listings
  .filter((l) => l.id !== listing.id && isDiscoverable(l) && (l.type === listing.type || l.area === listing.area))
  .sort((a, b) => Number(b.area === listing.area) - Number(a.area === listing.area) || Math.abs(a.rent - listing.rent) - Math.abs(b.rent - listing.rent))
  .slice(0, 4)

const moreFromAgent = listings.filter((l) => l.agentId === agent.id && l.id !== listing.id && isDiscoverable(l)).slice(0, 4)

const nextDue = Math.max(0, platformSettings.confirmationIntervalDays - listing.confirmedDaysAgo)

const waText = encodeURIComponent(`Hello ${agent.name}, I saw your listing on Flymedia: ${listing.title} in ${listing.neighbourhood} (${listing.id}). Is it still available?`)
const waLink = `https://wa.me/${agent.whatsapp}?text=${waText}`

async function share() {
  const shareUrl = `${window.location.origin}/apartments/${listing!.slug}`
  try {
    if (navigator.share) {
      await navigator.share({ title, text: priceText, url: shareUrl })
      return
    }
    await navigator.clipboard.writeText(shareUrl)
    show('Link copied to clipboard')
  } catch {
    /* user cancelled */
  }
}

const enquirySection = ref<HTMLElement | null>(null)
function scrollToEnquiry() {
  enquirySection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div>
    <div class="container-page pt-5">
      <Breadcrumbs
        :items="[
          { label: 'Home', to: '/' },
          { label: 'Apartments', to: '/apartments' },
          { label: area.stateName, to: searchLink({ state: area.state }) },
          { label: area.name, to: searchLink({ area: area.slug }) },
          { label: listing.title },
        ]"
      />

      <!-- Not available notice -->
      <div v-if="!isOpen" class="mt-4 flex items-start gap-3 rounded-[var(--radius-card)] bg-mist-100 p-4 text-sm text-mist-800 ring-1 ring-inset ring-mist-200">
        <Info class="mt-0.5 size-4 shrink-0" />
        <p>
          <strong class="font-semibold">This home is {{ meta.label.toLowerCase() }}.</strong>
          {{ meta.description }}
          <NuxtLink :to="searchLink({ area: listing.area, type: listing.type })" class="font-semibold text-brand-700 underline-offset-2 hover:underline">See similar available homes</NuxtLink>
        </p>
      </div>

      <!-- Title row -->
      <div class="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <StatusBadge :status="status" size="md" />
            <span v-if="listing.verified" class="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800 ring-1 ring-inset ring-brand-200">
              <BadgeCheck class="size-3.5" /> Flymedia verified home
            </span>
            <span v-if="listing.featured" class="rounded-full bg-sun-100 px-2.5 py-1 text-xs font-semibold text-sun-700">Featured</span>
            <span class="text-xs text-mist-500">Ref {{ listing.id }}</span>
          </div>
          <h1 class="mt-3 text-2xl font-extrabold sm:text-3xl">{{ listing.title }} in {{ listing.neighbourhood }}</h1>
          <p class="mt-1.5 flex items-center gap-1.5 text-[15px] text-mist-600">
            <MapPin class="size-4 shrink-0 text-mist-400" /> {{ listing.street ? `${listing.street}, ` : '' }}{{ fullLocation }}
          </p>
        </div>
        <div class="flex gap-2">
          <button type="button" class="btn btn-secondary" @click="share"><Share2 class="size-4" /> Share</button>
          <SaveButton :listing-id="listing.id" variant="button" />
        </div>
      </div>

      <div class="mt-5">
        <ListingGallery :images="listing.images" :title="`${listing.title} in ${listing.neighbourhood}`" :has-video-tour="listing.hasVideoTour" />
      </div>
    </div>

    <div class="container-page mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
      <!-- Main column -->
      <div class="min-w-0 space-y-10">
        <!-- Price -->
        <section class="flex flex-wrap items-end justify-between gap-4 border-b border-mist-200 pb-8">
          <div>
            <p class="text-sm text-mist-500">Rent</p>
            <p class="font-display text-3xl font-extrabold tracking-tight text-mist-950 tabular sm:text-4xl">
              {{ formatNaira(listing.rent) }}<span class="text-lg font-semibold text-mist-500"> / {{ periodLabel(listing.period) }}</span>
            </p>
            <p class="mt-1 text-sm text-mist-600">
              {{ listing.period === 'year' ? `${plural(listing.upfrontPeriods, 'year')} upfront` : `${listing.upfrontPeriods} months upfront` }} ·
              <a href="#costs" class="font-semibold text-brand-700 hover:underline">See full move-in cost</a>
            </p>
          </div>
          <div class="flex gap-6 text-sm text-mist-600">
            <span class="inline-flex items-center gap-1.5"><Eye class="size-4 text-mist-400" /> {{ compactNumber(listing.views) }} views</span>
            <span class="inline-flex items-center gap-1.5"><Heart class="size-4 text-mist-400" /> {{ listing.saves }} saves</span>
          </div>
        </section>

        <!-- Key facts -->
        <section aria-labelledby="facts-heading">
          <h2 id="facts-heading" class="text-xl font-bold">Property details</h2>
          <dl class="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-mist-200 bg-mist-200 sm:grid-cols-4">
            <div v-for="f in facts" :key="f.label" class="bg-white p-4">
              <dt class="flex items-center gap-1.5 text-xs text-mist-500"><component :is="f.icon" class="size-3.5" /> {{ f.label }}</dt>
              <dd class="mt-1 text-[15px] font-semibold text-mist-950">{{ f.value }}</dd>
            </div>
          </dl>
        </section>

        <!-- Description -->
        <section aria-labelledby="desc-heading">
          <h2 id="desc-heading" class="text-xl font-bold">About this home</h2>
          <div class="prose-flymedia mt-3 max-w-[68ch]">
            <p v-for="(p, i) in listing.description" :key="i">{{ p }}</p>
          </div>
        </section>

        <!-- Amenities -->
        <section aria-labelledby="amen-heading">
          <h2 id="amen-heading" class="text-xl font-bold">Amenities and utilities</h2>
          <div class="mt-4 grid gap-6 sm:grid-cols-2">
            <div v-for="g in groupedAmenities" :key="g.group">
              <h3 class="text-sm font-semibold text-mist-500">{{ g.group }}</h3>
              <ul class="mt-2 space-y-2">
                <li v-for="a in g.items" :key="a.id" class="flex items-center gap-2 text-[15px] text-mist-800">
                  <Check class="size-4 text-brand-600" /> {{ a.name }}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Costs -->
        <section id="costs" class="scroll-mt-24" aria-labelledby="cost-heading">
          <h2 id="cost-heading" class="text-xl font-bold">Rent and charges</h2>
          <p class="mt-1 text-sm text-mist-600">Amounts provided and confirmed by the agent. Flymedia never estimates missing fees.</p>
          <div class="mt-4">
            <ChargesBreakdown :listing="listing" />
          </div>
        </section>

        <!-- Availability -->
        <section aria-labelledby="avail-heading">
          <h2 id="avail-heading" class="text-xl font-bold">Availability</h2>
          <div class="mt-4 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-mist-200 bg-mist-200 sm:grid-cols-2">
            <div class="bg-white p-4">
              <p class="flex items-center gap-1.5 text-xs text-mist-500"><ShieldCheck class="size-3.5" /> Current status</p>
              <div class="mt-1.5"><StatusBadge :status="status" size="md" /></div>
              <p class="mt-2 text-[13px] leading-5 text-mist-600">{{ meta.description }}</p>
            </div>
            <div class="bg-white p-4">
              <p class="flex items-center gap-1.5 text-xs text-mist-500"><Clock3 class="size-3.5" /> Last confirmed</p>
              <p class="mt-1 text-[15px] font-semibold text-mist-950">{{ daysAgoText(listing.confirmedDaysAgo) }}</p>
              <p v-if="isOpen" class="mt-1 text-[13px] text-mist-600">
                {{ nextDue > 0 ? `Next confirmation due in ${plural(nextDue, 'day')}` : 'Confirmation is overdue' }}
              </p>
            </div>
            <div class="bg-white p-4">
              <p class="flex items-center gap-1.5 text-xs text-mist-500"><CalendarClock class="size-3.5" /> Listed · last updated</p>
              <p class="mt-1 text-[15px] font-semibold text-mist-950">{{ daysAgoText(listing.postedDaysAgo) }} · {{ daysAgoText(listing.updatedDaysAgo) }}</p>
            </div>
            <div class="bg-white p-4">
              <p class="flex items-center gap-1.5 text-xs text-mist-500"><UserRound class="size-3.5" /> Agent responsible</p>
              <NuxtLink :to="`/agents/${agent.slug}`" class="mt-1 block text-[15px] font-semibold text-brand-700 hover:underline">{{ agent.name }}</NuxtLink>
            </div>
          </div>
          <p class="mt-3 text-xs leading-5 text-mist-500">
            Availability confirmation and verification are separate. Agents confirm availability every
            {{ platformSettings.confirmationIntervalDays }} days. A “Flymedia verified” badge means our team has inspected the property.
          </p>
        </section>

        <!-- Location -->
        <section aria-labelledby="loc-heading">
          <h2 id="loc-heading" class="text-xl font-bold">Location</h2>
          <div class="mt-4 rounded-[var(--radius-card)] border border-mist-200 p-5">
            <p class="font-semibold text-mist-950">{{ listing.neighbourhood }}, {{ area.name }}</p>
            <p class="mt-1 text-sm text-mist-600">{{ area.blurb }}</p>
            <p class="mt-3 text-xs text-mist-500">The exact address is shared by the agent when you book an inspection.</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <NuxtLink :to="searchLink({ area: area.slug })" class="btn btn-secondary btn-sm">All homes in {{ area.name }}</NuxtLink>
              <NuxtLink :to="searchLink({ area: area.slug, type: listing.type })" class="btn btn-secondary btn-sm">{{ type.plural }} in {{ area.name }}</NuxtLink>
            </div>
          </div>
        </section>

        <div class="border-t border-mist-200 pt-6">
          <ReportListingDialog :listing-id="listing.id" />
        </div>
      </div>

      <!-- Contact column -->
      <aside ref="enquirySection" class="scroll-mt-20" aria-label="Contact the agent">
        <div class="space-y-4 lg:sticky lg:top-20">
          <div class="rounded-[var(--radius-card)] border border-mist-200 bg-white p-5">
            <div class="flex items-center gap-3">
              <AgentAvatar :agent="agent" size="lg" />
              <div class="min-w-0">
                <p class="text-xs text-mist-500">Listed by</p>
                <NuxtLink :to="`/agents/${agent.slug}`" class="block truncate font-bold text-mist-950 hover:text-brand-700">{{ agent.name }}</NuxtLink>
                <p v-if="agent.agency && agent.agency !== 'Independent agent'" class="truncate text-sm text-mist-600">{{ agent.agency }}</p>
                <div class="mt-1 flex items-center gap-3">
                  <VerifiedBadge v-if="agent.verified" label="Verified agent" />
                  <span class="inline-flex items-center gap-1 text-xs text-mist-600"><Star class="size-3.5 fill-sun-400 text-sun-400" /> {{ agent.rating.toFixed(1) }} ({{ agent.reviewCount }})</span>
                </div>
              </div>
            </div>
            <p class="mt-3 text-xs text-mist-500">{{ agent.responseTime }}</p>
            <div class="mt-4 grid grid-cols-2 gap-2">
              <a :href="`tel:${agent.phone.replace(/\s/g, '')}`" class="btn btn-secondary"><Phone class="size-4" /> Call</a>
              <a :href="waLink" target="_blank" rel="noopener" class="btn btn-whatsapp"><MessageCircle class="size-4" /> WhatsApp</a>
            </div>
            <div class="mt-5 border-t border-mist-100 pt-5">
              <EnquiryForm :listing="listing" :agent="agent" id-prefix="enq" />
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Similar -->
    <section v-if="similar.length" class="container-page mt-16">
      <SectionHeading title="Similar apartments" :subtitle="`Other available homes in and around ${area.name}.`" :link-to="searchLink({ area: area.slug })" link-label="See more" />
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ListingCard v-for="l in similar" :key="l.id" :listing="l" />
      </div>
    </section>

    <section v-if="moreFromAgent.length" class="container-page mb-16 mt-14">
      <SectionHeading :title="`More from ${agent.name}`" :link-to="`/agents/${agent.slug}`" link-label="View agent profile" />
      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ListingCard v-for="l in moreFromAgent" :key="l.id" :listing="l" />
      </div>
    </section>
    <div v-else class="mb-16" />

    <!-- Mobile action bar -->
    <div class="fixed inset-x-0 bottom-0 z-30 border-t border-mist-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <div class="flex items-center gap-2">
        <div class="mr-auto min-w-0">
          <p class="truncate font-display text-base font-extrabold text-mist-950 tabular">{{ formatNaira(listing.rent) }}<span class="text-xs font-semibold text-mist-500"> /{{ periodLabel(listing.period) }}</span></p>
          <p class="truncate text-xs text-mist-500">Confirmed {{ daysAgoText(listing.confirmedDaysAgo) }}</p>
        </div>
        <a :href="`tel:${agent.phone.replace(/\s/g, '')}`" class="btn btn-secondary size-11 p-0" aria-label="Call agent"><Phone class="size-4" /></a>
        <a :href="waLink" target="_blank" rel="noopener" class="btn btn-whatsapp size-11 p-0" aria-label="WhatsApp agent"><MessageCircle class="size-4" /></a>
        <button type="button" class="btn btn-primary" @click="scrollToEnquiry">Enquire</button>
      </div>
    </div>
  </div>
</template>
