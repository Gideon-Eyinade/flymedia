<script setup lang="ts">
import { Instagram, Facebook, Linkedin, Twitter, Youtube } from 'lucide-vue-next'
import { popularAreaSlugs, findArea } from '~/data/locations'
import { propertyTypes } from '~/data/catalog'
import { platformSettings } from '~/data/settings'

const popular = popularAreaSlugs.slice(0, 8).map((s) => findArea(s)!).filter(Boolean)
const year = new Date().getFullYear()

const socials = [
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'X (Twitter)', icon: Twitter, href: 'https://x.com' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
]
</script>

<template>
  <footer class="border-t border-mist-200 bg-mist-950 text-mist-300">
    <div class="container-page py-14">
      <div class="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div class="max-w-sm">
          <AppLogo inverted />
          <p class="mt-4 text-sm leading-6 text-mist-400">
            Flymedia helps you find apartments that are actually available, see the full cost before you inspect,
            and connect with agents who keep their listings up to date.
          </p>
          <div class="mt-5 flex gap-2">
            <a
              v-for="s in socials"
              :key="s.name"
              :href="s.href"
              target="_blank"
              rel="noopener"
              class="grid size-9 place-items-center rounded-lg border border-white/10 text-mist-300 transition-colors hover:border-white/25 hover:text-white"
              :aria-label="s.name"
            >
              <component :is="s.icon" class="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h2 class="mb-4 text-sm font-semibold text-white">Browse apartments</h2>
          <ul class="space-y-2.5 text-sm">
            <li><NuxtLink to="/apartments" class="hover:text-white">All apartments</NuxtLink></li>
            <li v-for="t in propertyTypes.slice(0, 5)" :key="t.slug">
              <NuxtLink :to="searchLink({ type: t.slug })" class="hover:text-white">{{ t.plural }}</NuxtLink>
            </li>
            <li><NuxtLink to="/property-types" class="hover:text-white">All property types</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h2 class="mb-4 text-sm font-semibold text-white">Popular locations</h2>
          <ul class="space-y-2.5 text-sm">
            <li v-for="a in popular" :key="a.slug">
              <NuxtLink :to="searchLink({ area: a.slug })" class="hover:text-white">Apartments in {{ a.name }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h2 class="mb-4 text-sm font-semibold text-white">For agents</h2>
          <ul class="space-y-2.5 text-sm">
            <li><NuxtLink to="/list-property" class="hover:text-white">List a property</NuxtLink></li>
            <li><NuxtLink to="/agents" class="hover:text-white">Find an agent</NuxtLink></li>
            <li><NuxtLink to="/signup?role=agent" class="hover:text-white">Create an agent account</NuxtLink></li>
            <li><NuxtLink to="/faq#agents" class="hover:text-white">Availability confirmation</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h2 class="mb-4 text-sm font-semibold text-white">Flymedia</h2>
          <ul class="space-y-2.5 text-sm">
            <li><NuxtLink to="/about" class="hover:text-white">About Flymedia</NuxtLink></li>
            <li><NuxtLink to="/request" class="hover:text-white">Request an apartment</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-white">Contact</NuxtLink></li>
            <li><NuxtLink to="/faq" class="hover:text-white">FAQs</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="hover:text-white">Privacy policy</NuxtLink></li>
            <li><NuxtLink to="/terms" class="hover:text-white">Terms and conditions</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-mist-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {{ year }} Flymedia. All rights reserved.</p>
        <p>{{ platformSettings.officeAddress }} · {{ platformSettings.supportEmail }}</p>
      </div>
    </div>
  </footer>
</template>
