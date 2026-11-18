<script setup lang="ts">
import { Mail, Phone, MapPin, MessageCircle, Clock3 } from 'lucide-vue-next'
import { platformSettings } from '~/data/settings'

useSeoMeta({ title: 'Contact Flymedia', description: 'Get help with a listing, report a problem or talk to the Flymedia team.' })

const { show } = useToast()
const sent = ref(false)
const form = reactive({ name: '', email: '', topic: 'general', message: '' })
const errors = reactive<Record<string, string>>({})

function submit() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (form.name.trim().length < 2) errors.name = 'Enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (form.message.trim().length < 10) errors.message = 'Tell us a little more.'
  if (Object.keys(errors).length) return
  sent.value = true
  show('Message sent', 'success')
}
</script>

<template>
  <div>
    <PageHeader crumb="Contact" title="Contact us" intro="Questions about a listing, an agent, or your account? We reply to every message within one working day." />
    <div class="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.3fr]">
      <div class="space-y-4">
        <div v-for="c in [
          { icon: Phone, label: 'Phone', value: platformSettings.supportPhone, href: `tel:${platformSettings.supportPhone.replace(/\s/g, '')}` },
          { icon: MessageCircle, label: 'WhatsApp', value: platformSettings.supportPhone, href: `https://wa.me/${platformSettings.supportWhatsApp}` },
          { icon: Mail, label: 'Email', value: platformSettings.supportEmail, href: `mailto:${platformSettings.supportEmail}` },
          { icon: MapPin, label: 'Office', value: platformSettings.officeAddress },
          { icon: Clock3, label: 'Hours', value: 'Monday to Friday, 8am to 6pm · Saturday, 10am to 2pm' },
        ]" :key="c.label" class="flex items-start gap-4 rounded-[var(--radius-card)] border border-mist-200 p-4">
          <span class="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700"><component :is="c.icon" class="size-5" /></span>
          <div class="min-w-0">
            <p class="text-xs text-mist-500">{{ c.label }}</p>
            <a v-if="c.href" :href="c.href" class="font-semibold text-mist-950 hover:text-brand-700" :target="c.href.startsWith('http') ? '_blank' : undefined" rel="noopener">{{ c.value }}</a>
            <p v-else class="font-semibold text-mist-950">{{ c.value }}</p>
          </div>
        </div>
        <p class="text-sm text-mist-600">
          Looking for an apartment? It’s faster to contact the agent from the listing, or
          <NuxtLink to="/request" class="font-semibold text-brand-700">send us a request</NuxtLink>.
        </p>
      </div>

      <div class="rounded-2xl border border-mist-200 p-5 sm:p-8">
        <div v-if="sent">
          <h2 class="text-xl font-bold">Thanks, {{ form.name.split(' ')[0] }}</h2>
          <p class="mt-2 text-mist-600">We’ll reply to {{ form.email }} within one working day.</p>
          <DemoNotice class="mt-5" />
        </div>
        <form v-else class="grid gap-4" novalidate @submit.prevent="submit">
          <h2 class="text-xl font-bold">Send a message</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="ct-name" class="field-label">Name</label>
              <input id="ct-name" v-model="form.name" class="field" autocomplete="name" :aria-invalid="!!errors.name" />
              <p v-if="errors.name" class="mt-1 text-xs text-rose-700">{{ errors.name }}</p>
            </div>
            <div>
              <label for="ct-email" class="field-label">Email</label>
              <input id="ct-email" v-model="form.email" type="email" class="field" autocomplete="email" :aria-invalid="!!errors.email" />
              <p v-if="errors.email" class="mt-1 text-xs text-rose-700">{{ errors.email }}</p>
            </div>
          </div>
          <div>
            <label for="ct-topic" class="field-label">Topic</label>
            <select id="ct-topic" v-model="form.topic" class="field">
              <option value="general">General question</option>
              <option value="listing">A problem with a listing</option>
              <option value="agent">A problem with an agent</option>
              <option value="agent-join">I’m an agent and want to list</option>
              <option value="partnership">Partnerships and press</option>
            </select>
          </div>
          <div>
            <label for="ct-message" class="field-label">Message</label>
            <textarea id="ct-message" v-model="form.message" rows="5" class="field" :aria-invalid="!!errors.message" />
            <p v-if="errors.message" class="mt-1 text-xs text-rose-700">{{ errors.message }}</p>
          </div>
          <button type="submit" class="btn btn-primary w-fit">Send message</button>
        </form>
      </div>
    </div>
  </div>
</template>
