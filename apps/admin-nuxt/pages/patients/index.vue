<template>
  <div class="space-y-8">
    <!-- Hero Header -->
    <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 p-6 text-white shadow-lg">
      <div class="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-sky-400/20 blur-2xl"></div>

      <div class="relative space-y-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-2">
            <UBadge color="white" variant="soft" size="sm" class="text-sky-700">
              <UIcon name="i-lucide-users" class="h-3 w-3" />
              Operations Hub
            </UBadge>
            <h1 class="text-2xl font-bold lg:text-3xl">Manage Patients</h1>
            <p class="max-w-2xl text-sm text-sky-100">
              Maintain accurate contact details to streamline scheduling, reminders, and coordinated follow-ups across your clinic.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <UButton
              variant="ghost"
              color="white"
              :loading="pending"
              class="hover:bg-white/20"
              icon="i-lucide-refresh-cw"
              size="sm"
              @click="refresh"
            >
              Refresh
            </UButton>
            <UButton
              icon="i-lucide-user-round-plus"
              color="white"
              size="md"
              class="!text-sky-700 shadow-md hover:bg-white"
              @click="openCreate"
            >
              <span class="text-sky-700 font-medium">Add Patient</span>
            </UButton>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid gap-3 sm:grid-cols-3">
          <div class="group rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-sky-200">Total Patients</p>
                <p class="mt-1 text-2xl font-bold">{{ totalItems }}</p>
                <p class="mt-0.5 text-xs text-sky-200">Active patient profiles</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <UIcon name="i-lucide-users" class="h-5 w-5" />
              </div>
            </div>
          </div>

          <div class="group rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-sky-200">Current Page</p>
                <p class="mt-1 text-2xl font-bold">{{ patients.length }}</p>
                <p class="mt-0.5 text-xs text-sky-200">Page {{ page }} of {{ totalPages }}</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <UIcon name="i-lucide-file-text" class="h-5 w-5" />
              </div>
            </div>
          </div>

          <div class="group rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-sky-200">Reachable by Email</p>
                <p class="mt-1 text-2xl font-bold">{{ withEmail }}</p>
                <p class="mt-0.5 text-xs text-sky-200">On current page</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <UIcon name="i-lucide-mail" class="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <div class="rounded-lg bg-sky-100 p-1.5">
          <UIcon name="i-lucide-search" class="h-4 w-4 text-sky-600" />
        </div>
        <div>
          <p class="text-xs font-medium text-slate-700">Patient Search</p>
          <p class="text-xs text-slate-500">Find by name, email, phone, or ID</p>
        </div>
      </div>
      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Search patients by name or contact..."
        class="w-full max-w-md"
        size="md"
      />
    </div>

    <!-- Patients Directory -->
    <UCard class="shadow-card overflow-hidden">
      <template #header>
        <div class="flex items-center gap-2.5">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
            <UIcon name="i-lucide-address-book" class="h-4 w-4" />
          </div>
          <div>
            <h2 class="text-base font-semibold text-slate-900">Patient Directory</h2>
            <p class="text-xs text-slate-500">
              {{ totalItems }} total patients • {{ filteredRows.length }} shown
            </p>
          </div>
        </div>
      </template>

      <div v-if="pending && !patients.length" class="space-y-2 p-3">
        <USkeleton v-for="i in 6" :key="`patient-skeleton-${i}`" class="h-20 rounded-lg" />
      </div>

      <div v-else-if="!filteredRows.length" class="py-12 text-center">
        <div class="mx-auto max-w-md space-y-3">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-sky-50">
            <UIcon name="i-lucide-user-x" class="h-6 w-6 text-sky-600" />
          </div>
          <div class="space-y-1.5">
            <h3 class="text-lg font-semibold text-slate-900">No patients found</h3>
            <p class="text-xs text-slate-500">
              {{ search ? 'No results match your search criteria. Try adjusting your search terms.' : 'Add a new patient to get started with the directory.' }}
            </p>
          </div>
          <div class="flex justify-center gap-3">
            <UButton v-if="search" color="gray" variant="outline" @click="search = ''">
              Clear Search
            </UButton>
            <UButton color="sky" variant="solid" @click="openCreate">
              <UIcon name="i-lucide-user-round-plus" class="h-4 w-4" />
              Add Patient
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
              base: '!text-sky-900 !font-semibold !bg-sky-200',
              padding: 'px-3 py-3',
              color: 'text-sky-900'
            },
            tbody: 'divide-y divide-slate-100',
            tr: {
              base: 'hover:bg-sky-50/50 transition-colors'
            },
            td: {
              padding: 'px-3 py-3'
            }
          }"
        >
          <template #fullName-data="{ row }">
            <div class="flex items-center gap-2.5">
              <UAvatar
                size="sm"
                :alt="row.fullName"
                class="ring-2 ring-sky-100"
              />
              <div>
                <p class="text-sm font-semibold text-slate-900">{{ row.fullName }}</p>
                <div class="flex items-center gap-1 mt-0.5">
                  <UIcon name="i-lucide-hash" class="h-2.5 w-2.5 text-slate-400" />
                  <p class="text-xs text-slate-500">{{ row.externalId }}</p>
                </div>
              </div>
            </div>
          </template>

          <template #contact-data="{ row }">
            <div class="space-y-1">
              <div v-if="row.email" class="flex items-center gap-1.5">
                <div class="flex h-5 w-5 items-center justify-center rounded bg-sky-50">
                  <UIcon name="i-lucide-mail" class="h-3 w-3 text-sky-600" />
                </div>
                <span class="text-xs text-slate-700">{{ row.email }}</span>
              </div>
              <div v-else class="flex items-center gap-1.5">
                <div class="flex h-5 w-5 items-center justify-center rounded bg-slate-50">
                  <UIcon name="i-lucide-mail" class="h-3 w-3 text-slate-400" />
                </div>
                <span class="text-xs text-slate-400 italic">No email</span>
              </div>

              <div v-if="row.phone" class="flex items-center gap-1.5">
                <div class="flex h-5 w-5 items-center justify-center rounded bg-emerald-50">
                  <UIcon name="i-lucide-phone" class="h-3 w-3 text-emerald-600" />
                </div>
                <span class="text-xs text-slate-700">{{ row.phone }}</span>
              </div>
              <div v-else class="flex items-center gap-1.5">
                <div class="flex h-5 w-5 items-center justify-center rounded bg-slate-50">
                  <UIcon name="i-lucide-phone" class="h-3 w-3 text-slate-400" />
                </div>
                <span class="text-xs text-slate-400 italic">No phone</span>
              </div>
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
              <UTooltip text="View Details">
                <button
                  @click.stop="openEdit(row)"
                  class="group relative flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600 transition-all hover:bg-sky-500 hover:text-white hover:shadow-md hover:shadow-sky-500/30"
                >
                  <UIcon
                    name="i-lucide-eye"
                    class="h-3.5 w-3.5 transition-transform group-hover:scale-110"
                  />
                </button>
              </UTooltip>

              <UTooltip text="Delete Patient">
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

      <template #footer v-if="totalPages > 1">
        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/50 px-3 py-3">
          <div class="text-xs font-medium text-slate-700">
            Showing <span class="font-semibold text-slate-900">{{ (page - 1) * pageSize + 1 }}</span> to <span class="font-semibold text-slate-900">{{ Math.min(page * pageSize, totalItems) }}</span> of <span class="font-semibold text-slate-900">{{ totalItems }}</span> patients
          </div>
          <UPagination
            v-model="page"
            :page-count="pageSize"
            :total="totalItems"
            show-first
            show-last
            :ui="{
              wrapper: 'flex items-center gap-1',
              rounded: 'first:rounded-s-lg last:rounded-e-lg',
              base: '!text-slate-700 font-medium',
              default: {
                size: 'md',
                activeButton: {
                  variant: 'solid',
                  color: 'sky',
                  class: '!text-white'
                },
                inactiveButton: {
                  color: 'white',
                  variant: 'outline',
                  class: '!text-slate-700 !border-slate-300 hover:!bg-sky-50 hover:!border-sky-300'
                },
                firstButton: {
                  class: '!text-slate-700'
                },
                lastButton: {
                  class: '!text-slate-700'
                },
                prevButton: {
                  class: '!text-slate-700'
                },
                nextButton: {
                  class: '!text-slate-700'
                }
              }
            }"
          />
        </div>
      </template>
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
              <h3 class="text-base font-semibold text-slate-900">Delete Patient</h3>
              <p class="mt-0.5 text-xs text-slate-500">
                This action cannot be undone
              </p>
            </div>
          </div>
        </template>

        <div class="space-y-3">
          <div class="rounded-lg bg-red-50 border border-red-100 p-3">
            <p class="text-xs text-slate-700">
              You are about to permanently delete <strong class="font-semibold text-slate-900">{{ deleteTarget?.fullName }}</strong>.
            </p>
            <p class="mt-1.5 text-xs text-slate-600">
              This will remove all patient contact information and history.
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
              Delete Patient
            </UButton>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { PatientAdmin } from "@/types/patients";

useHead({
  title: "Patients – Clinic Admin"
});

const toast = useToast();
const { fetcher, request } = useAdminApi();
const router = useRouter();

// Pagination state
const page = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const { data, pending, refresh: baseRefresh } = await useAsyncData(
  () => `admin-patients-page-${page.value}`,
  () => fetchPatients()
);

async function fetchPatients() {
  const queryParams = `page=${page.value - 1}&size=${pageSize.value}`;
  const response = await fetcher<any>(
    `/patients?${queryParams}`,
    { content: [], totalElements: 0, totalPages: 0, number: 0, size: pageSize.value }
  );

  // Handle both paginated response and array response
  if (Array.isArray(response)) {
    totalItems.value = response.length;
    return response;
  }

  // Spring Boot paginated response structure
  totalItems.value = response.totalElements || 0;
  return response.content || [];
}

async function refresh() {
  try {
    await baseRefresh();
  } catch (error: any) {
    toast.add({
      title: "Unable to refresh patients",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  }
}

const patients = computed(() => data.value ?? []);

// Watch for page changes
watch(page, async () => {
  try {
    await baseRefresh();
  } catch (error: any) {
    toast.add({
      title: "Unable to load patients",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  }
});

const newThisMonth = computed(() => {
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const count = patients.value.filter(patient => {
    if (!patient.createdAt) return false;
    return new Date(patient.createdAt).getTime() >= cutoff;
  }).length;
  return count.toString();
});

const withEmail = computed(() =>
  patients.value.filter(patient => Boolean(patient.email?.trim())).length.toString()
);

const search = ref("");
const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

const rows = computed(() =>
  patients.value.map(patient => ({
    ...patient,
    fullName: `${patient.firstName} ${patient.lastName}`,
    createdAt: patient.createdAt ? dateFormatter.format(new Date(patient.createdAt)) : "—"
  }))
);

const filteredRows = computed(() => {
  if (!search.value.trim()) {
    return rows.value;
  }
  const term = search.value.toLowerCase();
  return rows.value.filter(row =>
    [row.fullName, row.email, row.phone, row.externalId]
      .filter(Boolean)
      .some(value => value?.toLowerCase().includes(term))
  );
});

const columns = [
  { key: "fullName", label: "Patient", sortable: true, class: "min-w-[250px]" },
  { key: "contact", label: "Contact Information", class: "min-w-[300px]" },
  { key: "createdAt", label: "Registered", class: "w-44" },
  { key: "actions", label: "Actions", class: "w-32 text-right" }
];

const deleteOpen = ref(false);
const deleteTarget = ref<{ id: number; fullName: string } | null>(null);
const deleting = ref(false);

function openCreate() {
  router.push("/patients/new");
}

function openEdit(row: (typeof rows.value)[number]) {
  router.push(`/patients/${row.id}`);
}

function confirmRemove(row: (typeof rows.value)[number]) {
  deleteTarget.value = { id: row.id, fullName: row.fullName };
  deleteOpen.value = true;
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await request(`/patients/${deleteTarget.value.id}`, { method: "DELETE" });
    toast.add({ title: "Patient deleted" });
    deleteOpen.value = false;
    deleteTarget.value = null;

    // If current page becomes empty and it's not page 1, go to previous page
    if (patients.value.length === 1 && page.value > 1) {
      page.value--;
    } else {
      await baseRefresh();
    }
  } catch (error: any) {
    toast.add({
      title: "Unable to delete patient",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    deleting.value = false;
  }
}
</script>
