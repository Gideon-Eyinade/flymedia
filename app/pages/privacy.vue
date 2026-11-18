<script setup lang="ts">
import { platformSettings } from '~/data/settings'

useSeoMeta({ title: 'Privacy policy', description: 'How Flymedia collects, uses and protects your personal data.' })
</script>

<template>
  <div>
    <PageHeader crumb="Privacy policy" title="Privacy policy" intro="Draft for legal review. Last updated November 2026." />
    <article class="prose-flymedia container-page max-w-3xl py-12">
      <p>This policy explains what personal data Flymedia collects, why we collect it and the choices you have. We process personal data in line with the Nigeria Data Protection Act 2023.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Account details: your name, email address, phone number and password.</li>
        <li>Enquiries and inspection requests you send to agents, including your message and preferred dates.</li>
        <li>Apartment requests: preferred areas, budget and contact details.</li>
        <li>For agents: identity and business documents submitted for verification, and listing content.</li>
        <li>Usage data such as pages viewed, searches and saved homes, used to improve the service.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To connect you with the agent or landlord you contact.</li>
        <li>To remind agents to confirm availability and to keep listings accurate.</li>
        <li>To verify agents and investigate reported listings.</li>
        <li>To send service messages you’ve asked for, such as saved-search alerts.</li>
      </ul>
      <h2>Who we share it with</h2>
      <p>We share your contact details only with the agent you contact, or with agents who have matching homes when you submit an apartment request. We use service providers for hosting, email and messaging under contracts that protect your data. We do not sell personal data.</p>
      <h2>Your rights</h2>
      <p>You can ask to access, correct or delete your personal data, or object to how we use it. Email {{ platformSettings.supportEmail }} and we’ll respond within 30 days.</p>
      <h2>Retention</h2>
      <p>We keep account data while your account is active, and enquiry records for up to two years to help resolve disputes.</p>
    </article>
  </div>
</template>
