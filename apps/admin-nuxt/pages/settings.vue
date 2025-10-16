<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Settings</h1>
        <p class="mt-1 text-sm text-slate-500">
          Global preferences placeholder while the configuration center is under construction.
        </p>
      </div>
    </header>

    <div class="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white py-20">
      <div class="max-w-md space-y-3 text-center">
        <UAvatar icon="i-lucide-settings" size="xl" class="mx-auto" color="gray" variant="soft" />
        <h2 class="text-xl font-semibold text-slate-800">Admin settings coming soon</h2>
        <p class="text-sm text-slate-500">
          We are building dedicated panels for billing, notifications, and integration keys. Expect updates shortly.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Settings – Clinic Admin"
});
</script>
