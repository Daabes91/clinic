<template>
  <div class="space-y-6">
    <!-- Hero Header -->
    <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white shadow-lg">
      <div class="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-emerald-400/20 blur-2xl"></div>

      <div class="relative space-y-4">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-2">
            <UBadge color="white" variant="soft" size="sm" class="text-emerald-700">
              <UIcon name="i-lucide-layers" class="h-3 w-3" />
              Service Catalogue
            </UBadge>
            <h1 class="text-2xl font-bold lg:text-3xl">Manage Services</h1>
            <p class="max-w-2xl text-sm text-emerald-100">
              Keep the clinic offering fresh. Update names, localized summaries, and curate what appears on the public booking site.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <UButton
              variant="ghost"
              color="white"
              :loading="pending"
              icon="i-lucide-refresh-cw"
              class="hover:bg-white/20"
              size="sm"
              @click="refresh"
            >
              Refresh
            </UButton>
            <UButton
              icon="i-lucide-plus"
              color="white"
              size="md"
              class="!text-emerald-700 shadow-md hover:bg-white"
              @click="openCreate"
            >
              <span class="text-emerald-700 font-medium">Add Service</span>
            </UButton>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid gap-3 sm:grid-cols-3">
          <div class="group rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-emerald-200">Total Services</p>
                <p class="mt-1 text-2xl font-bold">{{ services.length }}</p>
                <p class="mt-0.5 text-xs text-emerald-200">Currently visible in booking flow</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <UIcon name="i-lucide-layers" class="h-5 w-5" />
              </div>
            </div>
          </div>

          <div class="group rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-emerald-200">Linked Doctors</p>
                <p class="mt-1 text-2xl font-bold">{{ totalDoctors }}</p>
                <p class="mt-0.5 text-xs text-emerald-200">Unique doctors across catalogue</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <UIcon name="i-lucide-stethoscope" class="h-5 w-5" />
              </div>
            </div>
          </div>

          <div class="group rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-emerald-200">Recently Updated</p>
                <p class="mt-1 text-2xl font-bold">{{ recentlyUpdated }}</p>
                <p class="mt-0.5 text-xs text-emerald-200">Services refreshed in past 30 days</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <UIcon name="i-lucide-clock" class="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <div class="rounded-lg bg-emerald-100 p-1.5">
          <UIcon name="i-lucide-search" class="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-700">Service Search</p>
          <p class="text-xs text-slate-500">Find by name, summary, or slug</p>
        </div>
      </div>
      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Search services..."
        class="w-full max-w-md"
        size="md"
      />
    </div>

    <!-- Services Table -->
    <UCard class="shadow-card overflow-hidden">
      <template #header>
        <div class="flex items-center gap-2.5">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <UIcon name="i-lucide-layers" class="h-4 w-4" />
          </div>
          <div>
            <h2 class="text-base font-semibold text-slate-900">Service Catalogue</h2>
            <p class="text-xs text-slate-500">
              {{ services.length }} total services • {{ filteredRows.length }} shown
            </p>
          </div>
        </div>
      </template>

      <div v-if="pending && !services.length" class="space-y-2 p-3">
        <USkeleton v-for="i in 6" :key="`skeleton-${i}`" class="h-20 rounded-lg" />
      </div>

      <div v-else-if="!filteredRows.length" class="py-12 text-center">
        <div class="mx-auto max-w-md space-y-3">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50">
            <UIcon name="i-lucide-layers" class="h-6 w-6 text-emerald-600" />
          </div>
          <div class="space-y-1.5">
            <h3 class="text-lg font-semibold text-slate-900">No services found</h3>
            <p class="text-xs text-slate-500">
              {{ search ? 'No results match your search criteria. Try adjusting your search terms.' : 'Add a new treatment or service to get started with the catalogue.' }}
            </p>
          </div>
          <div class="flex justify-center gap-3">
            <UButton v-if="search" color="gray" variant="outline" @click="search = ''">
              Clear Search
            </UButton>
            <UButton color="emerald" variant="solid" @click="openCreate">
              <UIcon name="i-lucide-plus" class="h-4 w-4" />
              Add Service
            </UButton>
          </div>
        </div>
      </div>

      <div v-else class="overflow-x-auto">
        <UTable
          :rows="filteredRows"
          :columns="columns"
          :loading="pending"
          :ui="{
            wrapper: 'min-w-full',
            th: {
              base: '!text-emerald-900 !font-semibold !bg-emerald-200',
              padding: 'px-3 py-3',
              color: 'text-emerald-900'
            },
            tbody: 'divide-y divide-slate-100',
            tr: {
              base: 'hover:bg-emerald-50/50 transition-colors'
            },
            td: {
              padding: 'px-3 py-3'
            }
          }"
        >
          <template #name-data="{ row }">
            <div class="flex items-center gap-2.5">
              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 ring-2 ring-emerald-100">
                <UIcon name="i-lucide-briefcase-medical" class="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-900">{{ row.name }}</p>
                <p v-if="row.secondaryName" class="text-xs text-slate-500 mt-0.5">{{ row.secondaryName }}</p>
              </div>
            </div>
          </template>

          <template #summary-data="{ row }">
            <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">{{ row.summary }}</p>
          </template>

          <template #slug-data="{ row }">
            <div class="flex items-center gap-1.5">
              <div class="flex h-5 w-5 items-center justify-center rounded bg-slate-100">
                <UIcon name="i-lucide-hash" class="h-3 w-3 text-slate-500" />
              </div>
              <code class="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700">{{ row.slug }}</code>
            </div>
          </template>

          <template #doctorCount-data="{ row }">
            <div class="flex items-center gap-1.5">
              <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                <UIcon name="i-lucide-users" class="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <span class="text-xs font-semibold text-slate-900">{{ row.doctorCount }}</span>
            </div>
          </template>

          <template #createdAt-data="{ row }">
            <div class="flex items-center gap-1.5">
              <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50">
                <UIcon name="i-lucide-calendar-plus" class="h-3.5 w-3.5 text-violet-600" />
              </div>
              <span class="text-xs font-medium text-slate-700">{{ row.createdAt }}</span>
            </div>
          </template>

          <template #actions-data="{ row }">
            <div class="flex justify-end gap-1.5">
              <UTooltip text="Edit Service">
                <button
                  @click.stop="openEdit(row)"
                  class="group relative flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white hover:shadow-md hover:shadow-emerald-500/30"
                >
                  <UIcon
                    name="i-lucide-pencil"
                    class="h-3.5 w-3.5 transition-transform group-hover:scale-110"
                  />
                </button>
              </UTooltip>

              <UTooltip text="Delete Service">
                <button
                  @click.stop="confirmRemove(row)"
                  class="group relative flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-all hover:bg-red-500 hover:text-white hover:shadow-md hover:shadow-red-500/30"
                >
                  <UIcon
                    name="i-lucide-trash-2"
                    class="h-3.5 w-3.5 transition-transform group-hover:scale-110"
                  />
                </button>
              </UTooltip>
            </div>
          </template>
        </UTable>
      </div>
    </UCard>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="deleteOpen" :ui="{ width: 'sm:max-w-md' }">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100' }">
        <template #header>
          <div class="flex items-start gap-2.5">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
              <UIcon name="i-lucide-alert-triangle" class="h-4 w-4 text-red-600" />
            </div>
            <div class="flex-1">
              <h3 class="text-base font-semibold text-slate-900">Delete Service</h3>
              <p class="mt-0.5 text-xs text-slate-500">
                This action cannot be undone
              </p>
            </div>
          </div>
        </template>

        <div class="space-y-3">
          <div class="rounded-lg bg-red-50 border border-red-100 p-3">
            <p class="text-xs text-slate-700">
              You are about to permanently delete <strong class="font-semibold text-slate-900">{{ deleteTarget?.name }}</strong>.
            </p>
            <p class="mt-1.5 text-xs text-slate-600">
              This will remove the service from the public site and booking funnel immediately.
            </p>
          </div>

          <div class="flex justify-end gap-2 pt-1">
            <UButton
              variant="outline"
              color="gray"
              size="sm"
              :disabled="deleting"
              @click="deleteOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              color="red"
              size="sm"
              :loading="deleting"
              @click="handleDelete"
              icon="i-lucide-trash-2"
            >
              Delete Service
            </UButton>
          </div>
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
  { key: "name", label: "Service Name", sortable: true, class: "min-w-[250px]" },
  { key: "summary", label: "Description", class: "min-w-[300px] max-w-md" },
  { key: "slug", label: "Identifier", class: "w-44" },
  { key: "doctorCount", label: "Providers", class: "w-32" },
  { key: "createdAt", label: "Created", class: "w-44" },
  { key: "actions", label: "Actions", class: "w-32 text-right" }
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
