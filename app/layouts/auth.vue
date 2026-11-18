<template>
  <div class="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
    <div class="flex flex-col px-4 py-6 sm:px-10">
      <NuxtLink to="/" class="self-start" aria-label="Flymedia home"><AppLogo /></NuxtLink>
      <main id="main" class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
        <slot />
      </main>
      <p class="text-xs text-mist-500">© Flymedia · <NuxtLink to="/privacy" class="hover:text-mist-800">Privacy</NuxtLink> · <NuxtLink to="/terms" class="hover:text-mist-800">Terms</NuxtLink></p>
    </div>
    <div class="relative hidden lg:block">
      <img src="/images/living-14.jpg" alt="" class="absolute inset-0 size-full object-cover" />
      <div class="absolute inset-0 bg-mist-950/50" />
      <div class="absolute inset-x-10 bottom-10 max-w-md text-white">
        <p class="font-display text-2xl font-extrabold leading-snug">“The flat matched the photos exactly and the fees were the same as on the listing.”</p>
        <p class="mt-3 text-sm text-white/80">Adaeze O., moved to Lekki Phase 1</p>
      </div>
    </div>
    <ToastHost />
  </div>
</template>
