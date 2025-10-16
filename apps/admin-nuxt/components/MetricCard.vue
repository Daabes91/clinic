<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <p class="text-xs uppercase tracking-widest text-slate-400">{{ title }}</p>
    <p class="mt-3 text-2xl font-semibold text-slate-900">{{ metric }}</p>
    <p class="text-xs font-medium text-emerald-600">{{ change }}</p>
    <p class="mt-3 text-xs text-slate-500">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  metric: string;
  change: string;
  description: string;
}>();
</script>
