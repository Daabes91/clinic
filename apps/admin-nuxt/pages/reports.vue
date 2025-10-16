<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Reports</h1>
        <p class="mt-1 text-sm text-slate-500">
          Analytics workspace placeholder while dashboards and exports are being wired up.
        </p>
      </div>
      <UButton icon="i-lucide-download" color="emerald" label="Export data" size="lg" disabled />
    </header>

    <div class="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white py-20">
      <div class="max-w-md space-y-3 text-center">
        <UAvatar icon="i-lucide-bar-chart-3" size="xl" class="mx-auto" color="gray" variant="soft" />
        <h2 class="text-xl font-semibold text-slate-800">Reporting dashboards coming soon</h2>
        <p class="text-sm text-slate-500">
          KPI dashboards and data exports will land here soon. Until then, use the shared spreadsheets for monthly
          reporting.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Reports – Clinic Admin"
});
</script>
