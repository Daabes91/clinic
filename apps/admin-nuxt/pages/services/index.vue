<template>
  <div class="space-y-10">
    <header class="flex flex-wrap items-end justify-between gap-6 rounded-4xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 px-10 py-12 text-white shadow-2xl">
      <div class="space-y-4">
        <UBadge color="white" variant="soft" class="text-emerald-900">Catalogue</UBadge>
        <div>
          <h1 class="text-4xl font-semibold tracking-tight">Manage services</h1>
          <p class="text-sm text-white/80">
            Keep the clinic offering fresh. Update names, localized summaries, and curate what appears on the public site.
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <MetricCard
            title="Total services"
            :metric="services.length.toString()"
            change="Live"
            description="Currently visible in booking flow"
          />
          <MetricCard
            title="Linked doctors"
            :metric="totalDoctors.toString()"
            change="Across catalogue"
            description="Unique doctors attached to services"
          />
          <MetricCard
            title="Recently updated"
            :metric="recentlyUpdated"
            change="Past 30 days"
            description="Services refreshed this month"
          />
        </div>
      </div>
      <div class="flex items-center gap-3">
        <UButton variant="ghost" color="white" :loading="pending" @click="refresh">
          Refresh
        </UButton>
        <UButton icon="i-lucide-plus" color="white" class="text-emerald-700" @click="openCreate">
          Add service
        </UButton>
      </div>
    </header>

    <UCard class="shadow-card">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-widest text-slate-400">Catalogue</p>
            <h2 class="text-lg font-semibold text-slate-900">Published services</h2>
          </div>
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Search services"
            color="gray"
            class="w-full max-w-xs"
          />
        </div>
      </template>

      <div v-if="pending && !services.length" class="space-y-4">
        <USkeleton v-for="i in 5" :key="`skeleton-${i}`" class="h-12 rounded-2xl" />
      </div>

      <div v-else-if="!filteredRows.length" class="rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
        <div class="mx-auto max-w-md space-y-4">
          <UAvatar icon="i-lucide-layers" size="xl" class="mx-auto" color="gray" variant="soft" />
          <h3 class="text-xl font-semibold text-slate-900">No services found</h3>
          <p class="text-sm text-slate-500">
            Add a new treatment or adjust your search filters to see results.
          </p>
          <UButton icon="i-lucide-plus" color="emerald" variant="soft" @click="openCreate">
            Create service
          </UButton>
        </div>
      </div>

      <UTable
        v-else
        :rows="filteredRows"
        :columns="columns"
        :loading="pending"
        class="rounded-2xl"
      >
        <template #name-data="{ row }">
          <div class="flex flex-col">
            <span class="font-medium text-slate-900">{{ row.name }}</span>
            <span v-if="row.secondaryName" class="text-xs text-slate-500">{{ row.secondaryName }}</span>
          </div>
        </template>
        <template #summary-data="{ row }">
          <p class="text-sm text-slate-600 line-clamp-2">{{ row.summary }}</p>
        </template>
        <template #slug-data="{ row }">
          <code class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{{ row.slug }}</code>
        </template>
        <template #doctorCount-data="{ row }">
          <UBadge color="emerald" variant="soft">{{ row.doctorCount }}</UBadge>
        </template>
        <template #createdAt-data="{ row }">
          <span class="text-xs text-slate-500">{{ row.createdAt }}</span>
        </template>
        <template #actions-data="{ row }">
          <div class="flex justify-end gap-2">
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              color="gray"
              size="xs"
              class="hover:bg-emerald-50"
              aria-label="Edit"
              @click="openEdit(row)"
            />
            <UButton
              icon="i-lucide-trash-2"
              variant="ghost"
              color="red"
              size="xs"
              class="hover:bg-red-50"
              aria-label="Delete"
              @click="confirmRemove(row)"
            />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="deleteOpen" :ui="deleteModalUi">
      <UCard class="border-0 shadow-card">
        <template #header>
          <div>
            <p class="text-sm font-medium text-red-600">Delete service</p>
            <h3 class="text-xl font-semibold text-slate-900">This action cannot be reversed</h3>
            <p class="mt-1 text-sm text-slate-500">
              Removing a service immediately hides it from the public site and the booking funnel.
            </p>
          </div>
        </template>
        <p class="text-sm text-slate-600">
          Are you sure you want to delete <strong>{{ deleteTarget?.name }}</strong>?
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <UButton variant="ghost" color="gray" :disabled="deleting" @click="deleteOpen = false">
            Cancel
          </UButton>
          <UButton color="red" :loading="deleting" @click="handleDelete">
            Delete
          </UButton>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { AdminServiceSummary } from "@/types/services";

const toast = useToast();
const { fetcher, request } = useAdminApi();

const { data, pending, refresh } = await useAsyncData("admin-services", () =>
  fetcher<AdminServiceSummary[]>("/services", [])
);

const services = computed(() => data.value ?? []);
const totalDoctors = computed(
  () => new Set(services.value.flatMap(service => service.doctorCount ? [service.slug] : [])).size
);
const recentlyUpdated = computed(() =>
  services.value.filter(service => service.createdAt && daysSince(service.createdAt) <= 30).length.toString()
);

const search = ref("");

const columns = [
  { key: "name", label: "Service", sortable: true },
  { key: "summary", label: "Summary", class: "max-w-md" },
  { key: "slug", label: "Slug" },
  { key: "doctorCount", label: "Doctors" },
  { key: "createdAt", label: "Created" },
  { key: "actions", label: "", class: "w-24 text-right" }
];

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

const rows = computed(() =>
  services.value.map(service => ({
    id: service.id,
    slug: service.slug,
    nameEn: service.nameEn,
    nameAr: service.nameAr,
    name: service.nameEn ?? service.nameAr ?? "—",
    secondaryName: service.nameEn && service.nameAr && service.nameEn !== service.nameAr ? service.nameAr : null,
    summaryEn: service.summaryEn,
    summaryAr: service.summaryAr,
    summary: service.summaryEn ?? service.summaryAr ?? "—",
    doctorCount: service.doctorCount,
    createdAt: service.createdAt ? dateFormatter.format(new Date(service.createdAt)) : "—"
  }))
);

const filteredRows = computed(() => {
  if (!search.value.trim()) {
    return rows.value;
  }
  const term = search.value.toLowerCase();
  return rows.value.filter(row =>
    [row.name, row.secondaryName, row.summary, row.slug].some(value =>
      value?.toLowerCase().includes(term)
    )
  );
});

const deleteOpen = ref(false);
const deleting = ref(false);
const deleteModalUi = {
  container: "flex min-h-full items-center justify-center text-center"
};

const deleteTarget = ref<{ id: number; name: string } | null>(null);
const router = useRouter();

function openCreate() {
  router.push("/services/new");
}

function openEdit(row: (typeof rows.value)[number]) {
  router.push(`/services/${row.id}`);
}

function confirmRemove(row: (typeof rows.value)[number]) {
  deleteTarget.value = { id: row.id, name: row.name };
  deleteOpen.value = true;
}

function daysSince(value: string | number) {
  const diff = Date.now() - new Date(value).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await request(`/services/${deleteTarget.value.id}`, {
      method: "DELETE"
    });
    toast.add({ title: "Service deleted" });
    deleteOpen.value = false;
    deleteTarget.value = null;
    await refresh();
  } catch (error: any) {
    toast.add({
      title: "Unable to delete service",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    deleting.value = false;
  }
}
</script>
