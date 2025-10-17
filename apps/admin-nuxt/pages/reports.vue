<template>
  <div class="space-y-8">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-8 text-white shadow-xl">
      <div class="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-emerald-400/20 blur-2xl"></div>

      <div class="relative flex flex-wrap items-start justify-between gap-6">
        <div class="space-y-3">
          <UBadge color="white" variant="soft" size="md" class="text-emerald-700">
            <UIcon name="i-lucide-bar-chart-3" class="h-3.5 w-3.5" />
            Insights Lab
          </UBadge>
        </div>
        <UButton icon="i-lucide-download" color="white" size="lg" disabled class="text-emerald-700 shadow-lg">
          Export data
        </UButton>
        <div class="basis-full space-y-2">
          <h1 class="text-3xl font-bold lg:text-4xl">Reports & analytics</h1>
          <p class="max-w-2xl text-emerald-100">
            Analytics dashboards and exports are being wired up. Soon you will be able to track growth, utilization, and revenue trends directly from this workspace.
          </p>
        </div>
      </div>
    </div>

    <UCard class="shadow-card">
      <div class="grid place-items-center py-16 text-center">
        <div class="max-w-md space-y-4">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <UIcon name="i-lucide-rocket" class="h-8 w-8 text-emerald-500" />
          </div>
          <h2 class="text-xl font-semibold text-slate-900">Reporting dashboards coming soon</h2>
          <p class="text-sm text-slate-500">
            KPI dashboards, cohort breakdowns, and data exports will land here shortly. Until then, use the shared spreadsheets for monthly reporting.
          </p>
          <div class="flex justify-center gap-2 text-xs text-slate-400">
            <span>Snapshot exports</span>
            <span aria-hidden="true">•</span>
            <span>Automated email digests</span>
            <span aria-hidden="true">•</span>
            <span>Custom KPI builder</span>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Reports – Clinic Admin"
});
</script>
