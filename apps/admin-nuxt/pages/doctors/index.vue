<template>
  <div class="space-y-6">
    <!-- Hero Header -->
    <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white shadow-lg">
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-emerald-500/20 blur-2xl"></div>

      <div class="relative">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-2">
            <UBadge color="white" variant="soft" size="sm" class="text-emerald-700">
              <UIcon name="i-lucide-stethoscope" class="h-3 w-3" />
              Operations
            </UBadge>
            <h1 class="text-2xl font-bold lg:text-3xl">Manage Doctors</h1>
            <p class="text-sm text-emerald-100">
              Keep provider profiles current so patients can find the right expertise
            </p>
          </div>
          
          <div class="flex items-center gap-2">
            <UButton
              variant="ghost"
              color="white"
              :loading="pending"
              icon="i-lucide-refresh-cw"
              size="sm"
              @click="refresh"
            >
              Refresh
            </UButton>
            <UButton
              icon="i-lucide-user-plus"
              color="white"
              size="md"
              class="!text-emerald-700 shadow-md"
              @click="openCreate"
            >
              <span class="text-emerald-700 font-medium">Add Doctor</span>
            </UButton>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="mt-6 grid gap-3 sm:grid-cols-3">
          <div class="rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-emerald-200">Total Doctors</p>
                <p class="mt-1 text-2xl font-bold">{{ doctors.length }}</p>
                <p class="mt-0.5 text-xs text-emerald-200">Active providers</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <UIcon name="i-lucide-users" class="h-5 w-5" />
              </div>
            </div>
          </div>

          <div class="rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-emerald-200">Specialties</p>
                <p class="mt-1 text-2xl font-bold">{{ uniqueSpecialties }}</p>
                <p class="mt-0.5 text-xs text-emerald-200">Areas of care</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <UIcon name="i-lucide-award" class="h-5 w-5" />
              </div>
            </div>
          </div>

          <div class="rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-emerald-200">Languages</p>
                <p class="mt-1 text-2xl font-bold">{{ uniqueLanguages }}</p>
                <p class="mt-0.5 text-xs text-emerald-200">Supported</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <UIcon name="i-lucide-globe" class="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Doctors Directory -->
    <UCard>
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-2.5">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <UIcon name="i-lucide-users" class="h-4 w-4" />
            </div>
            <div>
              <h2 class="text-base font-semibold text-slate-900">Doctors Directory</h2>
              <p class="text-xs text-slate-500">All registered medical professionals</p>
            </div>
          </div>
          <div class="w-full max-w-xs relative">
            <input
              type="text"
              placeholder="Search services"
              class="block w-full transition-all duration-200 border border-slate-300 focus:border-primary-500 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed form-input rounded-lg placeholder-gray-400 dark:placeholder-gray-500 h-9 text-sm px-9 py-1.5 shadow-sm bg-white text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-500"
              v-model="search"
            />
            <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span
                class="iconify i-lucide:search flex-shrink-0 text-gray-400 dark:text-gray-500 h-5 w-5"
                aria-hidden="true"
              ></span>
            </span>
          </div>
        </div>
      </template>

      <div v-if="pending && !doctors.length" class="space-y-2">
        <USkeleton v-for="i in 5" :key="`skeleton-${i}`" class="h-20 rounded-lg" />
      </div>

      <div v-else-if="!filteredRows.length" class="py-12 text-center">
        <div class="mx-auto max-w-md space-y-3">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <UIcon name="i-lucide-user-x" class="h-6 w-6 text-slate-400" />
          </div>
          <h3 class="text-lg font-semibold text-slate-900">No doctors found</h3>
          <p class="text-xs text-slate-500">
            Add a new practitioner or adjust your search filters to see results.
          </p>
          <UButton icon="i-lucide-user-plus" color="emerald" variant="soft" @click="openCreate">
            Create Doctor
          </UButton>
        </div>
      </div>

      <div v-else class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="row in filteredRows"
          :key="row.id"
          class="group relative overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 transition-all hover:border-emerald-300 hover:shadow-md cursor-pointer"
          @click="openEdit(row)"
        >
          <div class="flex items-start gap-3">
            <UAvatar
              :alt="row.fullName"
              size="md"
              class="ring-2 ring-emerald-100"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-semibold text-slate-900 truncate">{{ row.fullName }}</h3>
                  <p v-if="row.specialty" class="text-xs text-slate-600 truncate">
                    {{ row.specialty }}
                  </p>
                  <p v-else class="text-xs text-slate-400 italic">No specialty set</p>
                </div>
                <UDropdown :items="getRowActions(row)">
                  <UButton
                    icon="i-lucide-more-vertical"
                    variant="ghost"
                    color="gray"
                    size="xs"
                    @click.stop
                  />
                </UDropdown>
              </div>

              <div class="mt-2 flex flex-wrap gap-1.5">
                <UBadge
                  v-for="code in row.locales.slice(0, 3)"
                  :key="code"
                  color="emerald"
                  variant="soft"
                  size="xs"
                  class="uppercase"
                >
                  {{ code }}
                </UBadge>
                <UBadge
                  v-if="row.locales.length > 3"
                  color="gray"
                  variant="soft"
                  size="xs"
                >
                  +{{ row.locales.length - 3 }}
                </UBadge>
              </div>

              <div class="mt-2 flex items-center justify-between">
                <div class="flex items-center gap-1 text-xs text-slate-500">
                  <UIcon name="i-lucide-layers" class="h-3 w-3" />
                  <span>{{ row.services.length }} service{{ row.services.length !== 1 ? 's' : '' }}</span>
                </div>
                <span class="text-xs text-slate-400">{{ row.createdAt }}</span>
              </div>
            </div>
          </div>
          
          <!-- Hover indicator -->
          <div class="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300 group-hover:w-full"></div>
        </div>
      </div>
    </UCard>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="deleteOpen">
      <UCard>
        <template #header>
          <div class="flex items-start gap-2.5">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <UIcon name="i-lucide-trash-2" class="h-4 w-4" />
            </div>
            <div>
              <h3 class="text-base font-semibold text-slate-900">Delete Doctor</h3>
              <p class="mt-0.5 text-xs text-slate-600">This action cannot be undone</p>
            </div>
          </div>
        </template>

        <div class="space-y-3">
          <p class="text-xs text-slate-700">
            Are you sure you want to delete <strong>{{ deleteTarget?.fullName }}</strong>?
          </p>
          <div class="rounded-lg bg-red-50 p-3 border border-red-200">
            <p class="text-xs text-red-800">
              <UIcon name="i-lucide-alert-triangle" class="h-3.5 w-3.5 inline" />
              Removing a doctor disconnects them from all services and hides them from bookings.
            </p>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" color="gray" size="sm" :disabled="deleting" @click="deleteOpen = false">
              Cancel
            </UButton>
            <UButton color="red" size="sm" :loading="deleting" @click="handleDelete">
              Delete Doctor
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { DoctorAdmin } from "@/types/doctors";

useHead({
  title: "Doctors – Clinic Admin"
});

const toast = useEnhancedToast();
const { fetcher, request } = useAdminApi();
const router = useRouter();

const { data, pending, refresh } = await useAsyncData("admin-doctors", () =>
  fetcher<DoctorAdmin[]>("/doctors", [])
);

const doctors = computed(() => data.value ?? []);

const uniqueSpecialties = computed(() => {
  const specialties = new Set(
    doctors.value
      .map(doctor => doctor.specialty?.trim())
      .filter((value): value is string => Boolean(value))
  );
  return specialties.size;
});

const uniqueLanguages = computed(() => {
  const codes = new Set(doctors.value.flatMap(doctor => doctor.locales ?? []));
  return codes.size;
});

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

const rows = computed(() =>
  doctors.value.map(doctor => ({
    ...doctor,
    createdAt: doctor.createdAt ? dateFormatter.format(new Date(doctor.createdAt)) : "—"
  }))
);

const search = ref("");

const filteredRows = computed(() => {
  if (!search.value.trim()) {
    return rows.value;
  }
  const term = search.value.toLowerCase();
  return rows.value.filter(row =>
    [
      row.fullName,
      row.specialty,
      row.locales?.join(" "),
      row.services.map(service => service.nameEn ?? service.slug).join(" ")
    ]
      .filter(Boolean)
      .some(value => value?.toLowerCase().includes(term))
  );
});

const deleteOpen = ref(false);
const deleting = ref(false);
const deleteTarget = ref<DoctorAdmin | null>(null);

function openCreate() {
  router.push("/doctors/new");
}

function openEdit(row: DoctorAdmin) {
  router.push(`/doctors/${row.id}`);
}

function confirmRemove(row: DoctorAdmin) {
  deleteTarget.value = row;
  deleteOpen.value = true;
}

function getRowActions(row: DoctorAdmin) {
  return [
    [
      {
        label: "Edit",
        icon: "i-lucide-pencil",
        click: () => openEdit(row)
      },
      {
        label: "View Schedule",
        icon: "i-lucide-calendar",
        click: () => openEdit(row)
      }
    ],
    [
      {
        label: "Delete",
        icon: "i-lucide-trash-2",
        click: () => confirmRemove(row),
        class: "text-red-600"
      }
    ]
  ];
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await request(`/doctors/${deleteTarget.value.id}`, {
      method: "DELETE"
    });
    toast.deleted("Doctor");
    deleteOpen.value = false;
    deleteTarget.value = null;
    await refresh();
  } catch (error: any) {
    toast.error({
      title: "Unable to delete doctor",
      error
    });
  } finally {
    deleting.value = false;
  }
}
</script>