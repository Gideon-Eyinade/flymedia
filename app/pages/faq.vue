<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import { platformSettings } from '~/data/settings'

const { confirmationIntervalDays: interval, confirmationGraceDays: grace } = platformSettings

const groups = [
  {
    id: 'seekers',
    title: 'Finding an apartment',
    items: [
      { q: 'What does “Availability confirmed 2 days ago” mean?', a: `The agent last told us the home was still available two days ago. Agents must re-confirm every ${interval} days. If they don’t, the listing changes to “Awaiting confirmation”, and after another ${grace} days it is hidden from search.` },
      { q: 'What is the difference between “Available” and “Verified”?', a: 'Availability is confirmed by the agent. “Flymedia verified” means a member of our team has inspected the property, and a verified agent has passed identity and business checks. The two are separate: a listing can be available without being verified.' },
      { q: 'Why don’t some listings show a move-in total?', a: 'We only add up the cost of moving in when the agent has confirmed that the listed charges are all you will pay. If they haven’t, we show the charges we know about and ask you to confirm the rest with the agent. We never estimate fees.' },
      { q: 'Do I pay Flymedia anything?', a: 'No. Searching, saving homes and contacting agents is free. You pay rent and any fees directly to the landlord or agent under your tenancy agreement.' },
      { q: 'How do I stay safe?', a: 'Never pay rent, fees or an “inspection deposit” before you have inspected the property in person and seen the tenancy agreement. If an agent asks for money first, report the listing.' },
    ],
  },
  {
    id: 'agents',
    title: 'For agents and landlords',
    items: [
      { q: 'How do I list a property?', a: 'Create an agent account and use “List a property”. The form takes about ten minutes. New listings are reviewed by our team before they go live, usually within one working day.' },
      { q: 'How does availability confirmation work?', a: `Every ${interval} days we remind you to confirm each listing. You can confirm with one tap from the reminder. If a listing isn’t confirmed, it shows “Awaiting confirmation”, and after ${grace} more days it is hidden until you confirm it again.` },
      { q: 'How do I get a verified badge?', a: 'Submit your ID and, for agencies, your CAC registration. Our team reviews documents and may call or visit. Verification can be withdrawn if listings repeatedly turn out to be unavailable or inaccurate.' },
      { q: 'What happens when a property is rented?', a: 'Mark it as rented from your dashboard. It disappears from search immediately and appears under “Recently rented” on your profile.' },
    ],
  },
  {
    id: 'account',
    title: 'Account and privacy',
    items: [
      { q: 'Where are my saved homes stored?', a: 'In this preview, saved homes are kept in your browser on this device. Once accounts launch, they will sync to your account.' },
      { q: 'Who sees my phone number?', a: 'Only the agent you contact, or agents with matching homes if you submit an apartment request.' },
    ],
  },
]

useSeoMeta({ title: 'Frequently asked questions', description: 'How availability confirmation, verification and fees work on Flymedia, for tenants and agents.' })
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: groups.flatMap((g) => g.items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } }))),
      }),
    },
  ],
})
</script>

<template>
  <div>
    <PageHeader crumb="FAQs" title="Frequently asked questions" intro="How availability, verification and fees work on Flymedia.">
      <nav class="mt-5 flex flex-wrap gap-2" aria-label="FAQ sections">
        <a v-for="g in groups" :key="g.id" :href="`#${g.id}`" class="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-mist-700 ring-1 ring-inset ring-mist-200 hover:ring-brand-300">{{ g.title }}</a>
      </nav>
    </PageHeader>
    <div class="container-page max-w-3xl space-y-12 py-12">
      <section v-for="g in groups" :id="g.id" :key="g.id" class="scroll-mt-24">
        <h2 class="text-xl font-bold">{{ g.title }}</h2>
        <div class="mt-4 divide-y divide-mist-200 rounded-[var(--radius-card)] border border-mist-200">
          <details v-for="item in g.items" :key="item.q" class="group">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-mist-950 [&::-webkit-details-marker]:hidden">
              {{ item.q }}
              <ChevronDown class="size-4 shrink-0 text-mist-400 transition-transform group-open:rotate-180" />
            </summary>
            <p class="px-5 pb-5 text-[15px] leading-7 text-mist-700">{{ item.a }}</p>
          </details>
        </div>
      </section>
      <p class="text-sm text-mist-600">Still have a question? <NuxtLink to="/contact" class="font-semibold text-brand-700">Contact us</NuxtLink>.</p>
    </div>
  </div>
</template>
