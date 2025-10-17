<template>
  <div class="space-y-6">
    <!-- Hero Header -->
    <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 p-6 text-white shadow-lg">
      <div class="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-violet-400/20 blur-2xl"></div>

      <div class="relative space-y-4">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-2">
            <UBadge color="white" variant="soft" size="sm" class="text-violet-700">
              <UIcon name="i-lucide-calendar" class="h-3 w-3" />
              Schedule Management
            </UBadge>
            <h1 class="text-2xl font-bold lg:text-3xl">Appointments</h1>
            <p class="max-w-2xl text-sm text-violet-100">
              Monitor upcoming visits, doctor schedules, and service utilization in one place.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <UButton
              variant="ghost"
              color="white"
              size="sm"
              :loading="pending"
              icon="i-lucide-refresh-cw"
              class="hover:bg-white/20"
              @click="refresh"
            >
              Refresh
            </UButton>
            <UButton
              icon="i-lucide-calendar-plus"
              color="white"
              size="md"
              class="!text-violet-700 shadow-md hover:bg-white"
              @click="openCreate"
            >
              <span class="text-violet-700 font-medium">New Appointment</span>
            </UButton>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid gap-3 sm:grid-cols-3">
          <div class="group rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-violet-200">Total Appointments</p>
                <p class="mt-1.5 text-2xl font-bold">{{ totalItems }}</p>
                <p class="mt-1 text-xs text-violet-200">Within selected range</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-all group-hover:bg-white/20">
                <UIcon name="i-lucide-calendar-range" class="h-5 w-5" />
              </div>
            </div>
          </div>

          <div class="group rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-violet-200">Completed</p>
                <p class="mt-1.5 text-2xl font-bold">{{ completedCount }}</p>
                <p class="mt-1 text-xs text-violet-200">Historic records</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-all group-hover:bg-white/20">
                <UIcon name="i-lucide-check-circle" class="h-5 w-5" />
              </div>
            </div>
          </div>

          <div class="group rounded-lg bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-violet-200">Current Page</p>
                <p class="mt-1.5 text-2xl font-bold">{{ appointments.length }}</p>
                <p class="mt-1 text-xs text-violet-200">Page {{ page }} of {{ totalPages }}</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-all group-hover:bg-white/20">
                <UIcon name="i-lucide-file-text" class="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters & Search Bar -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-3">
        <div class="rounded-lg bg-violet-100 p-2">
          <UIcon name="i-lucide-filter" class="h-5 w-5 text-violet-600" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-slate-700">Filter:</span>
          <USelect
            v-model="filter"
            :options="filterOptions"
            value-attribute="value"
            option-attribute="label"
            size="sm"
            class="min-w-[160px]"
            :ui="selectPaddingUi"
          />
        </div>
        <!-- Active Query Filters -->
        <div v-if="doctorIdQuery || patientIdQuery" class="flex items-center gap-2">
          <UBadge v-if="doctorIdQuery" color="emerald" variant="soft" size="md">
            <UIcon name="i-lucide-stethoscope" class="h-3 w-3" />
            Doctor: {{ doctorIdQuery }}
            <button @click="clearDoctorFilter" class="ml-1.5 hover:bg-emerald-200 rounded-full p-0.5">
              <UIcon name="i-lucide-x" class="h-2.5 w-2.5" />
            </button>
          </UBadge>
          <UBadge v-if="patientIdQuery" color="blue" variant="soft" size="md">
            <UIcon name="i-lucide-user" class="h-3 w-3" />
            Patient: {{ patientIdQuery }}
            <button @click="clearPatientFilter" class="ml-1.5 hover:bg-blue-200 rounded-full p-0.5">
              <UIcon name="i-lucide-x" class="h-2.5 w-2.5" />
            </button>
          </UBadge>
        </div>
      </div>
      <UInput
        v-model="search"
        icon="i-lucide-search"
        placeholder="Search by patient, doctor, or service..."
        class="w-full max-w-md"
        size="md"
      />
    </div>

    <!-- Appointments Table -->
    <UCard class="shadow-md overflow-hidden">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
            <UIcon name="i-lucide-clipboard-list" class="h-4 w-4" />
          </div>
          <div>
            <h2 class="text-base font-semibold text-slate-900">Appointment Schedule</h2>
            <p class="text-xs text-slate-500">
              {{ totalItems }} total • Page {{ page }} of {{ totalPages }}
            </p>
          </div>
        </div>
      </template>

      <div v-if="pending && !appointments.length" class="space-y-3 p-4">
        <USkeleton v-for="i in 8" :key="`skeleton-${i}`" class="h-24 rounded-xl" />
      </div>

      <div v-else-if="!filteredRows.length" class="py-20 text-center">
        <div class="mx-auto max-w-md space-y-5">
          <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-violet-50">
            <UIcon name="i-lucide-calendar-x" class="h-10 w-10 text-violet-600" />
          </div>
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-slate-900">No appointments found</h3>
            <p class="text-sm text-slate-500">
              {{ search ? 'No results match your search criteria. Try adjusting your search terms.' : 'Adjust the filter or refresh the schedule to see upcoming visits.' }}
            </p>
          </div>
          <div class="flex justify-center gap-3">
            <UButton color="gray" variant="outline" @click="search = ''">
              Clear Search
            </UButton>
            <UButton color="violet" variant="solid" @click="openCreate">
              <UIcon name="i-lucide-calendar-plus" class="h-4 w-4" />
              Schedule New Appointment
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
              base: '!text-violet-900 !font-semibold !bg-violet-200',
              padding: 'px-3 py-3',
              color: 'text-violet-900'
            },
            tbody: 'divide-y divide-slate-100',
            tr: {
              base: 'hover:bg-violet-50/50 transition-colors'
            },
            td: {
              padding: 'px-3 py-3'
            }
          }"
        >
        <template #patientName-data="{ row }">
          <div class="flex items-center gap-2">
            <UAvatar
              size="sm"
              :alt="row.patientName"
              class="ring-2 ring-violet-100"
            />
            <div>
              <p class="text-sm font-semibold text-slate-900">{{ row.patientName }}</p>
              <div class="flex items-center gap-1 mt-0.5">
                <UIcon name="i-lucide-briefcase-medical" class="h-2.5 w-2.5 text-slate-400" />
                <p class="text-xs text-slate-500">{{ row.serviceName }}</p>
              </div>
            </div>
          </div>
        </template>

        <template #doctorName-data="{ row }">
          <div class="flex items-center gap-2">
            <div class="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50">
              <UIcon name="i-lucide-stethoscope" class="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <span class="text-sm font-medium text-slate-700">{{ row.doctorName }}</span>
          </div>
        </template>

        <template #bookingMode-data="{ row }">
          <UBadge :color="modeColor(row.bookingMode)" variant="soft" size="sm" class="font-medium">
            <UIcon :name="row.bookingMode === 'VIRTUAL_CONSULTATION' ? 'i-lucide-video' : 'i-lucide-building-2'" class="h-3 w-3" />
            {{ row.bookingModeLabel }}
          </UBadge>
        </template>

        <template #status-data="{ row }">
          <UBadge
            :color="statusColor(row.status)"
            variant="soft"
            size="sm"
            class="font-medium"
          >
            <UIcon :name="statusIcon(row.status)" class="h-3 w-3" />
            {{ formatStatus(row.status) }}
          </UBadge>
        </template>

        <template #scheduledAt-data="{ row }">
          <div class="text-xs">
            <div class="flex items-center gap-1">
              <UIcon name="i-lucide-clock" class="h-3 w-3 text-slate-400" />
              <p class="font-semibold text-slate-900">{{ formatTime(row.scheduledAtRaw) }}</p>
            </div>
            <p class="text-xs text-slate-500 mt-0.5 ml-4">{{ formatDate(row.scheduledAtRaw) }}</p>
          </div>
        </template>

        <template #actions-data="{ row }">
          <div class="flex justify-end gap-1.5">
            <UTooltip text="Approve" v-if="canApprove(row.status)">
              <button
                :disabled="approveLoadingId === row.id"
                @click.stop="approveAppointment(row)"
                class="group relative flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white hover:shadow-md hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UIcon
                  v-if="approveLoadingId !== row.id"
                  name="i-lucide-check"
                  class="h-3.5 w-3.5"
                />
                <UIcon
                  v-else
                  name="i-lucide-loader-2"
                  class="h-3.5 w-3.5 animate-spin"
                />
              </button>
            </UTooltip>

            <UTooltip text="Decline" v-if="canDecline(row.status)">
              <button
                :disabled="declineLoadingId === row.id"
                @click.stop="declineAppointment(row)"
                class="group relative flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-600 transition-all hover:bg-red-500 hover:text-white hover:shadow-md hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UIcon
                  v-if="declineLoadingId !== row.id"
                  name="i-lucide-x"
                  class="h-3.5 w-3.5"
                />
                <UIcon
                  v-else
                  name="i-lucide-loader-2"
                  class="h-3.5 w-3.5 animate-spin"
                />
              </button>
            </UTooltip>

            <UTooltip text="View Details">
              <button
                @click.stop="openDetails(row)"
                class="group relative flex h-8 w-8 items-center justify-center rounded-md bg-violet-50 text-violet-600 transition-all hover:bg-violet-500 hover:text-white hover:shadow-md hover:shadow-violet-500/30"
              >
                <UIcon
                  name="i-lucide-arrow-right"
                  class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </UTooltip>
          </div>
        </template>
        </UTable>
      </div>

      <template #footer v-if="totalPages > 1">
        <div class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/50 px-4 py-4">
          <div class="text-sm font-medium text-slate-700">
            Showing <span class="font-semibold text-slate-900">{{ (page - 1) * pageSize + 1 }}</span> to <span class="font-semibold text-slate-900">{{ Math.min(page * pageSize, totalItems) }}</span> of <span class="font-semibold text-slate-900">{{ totalItems }}</span> appointments
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
                  color: 'violet',
                  class: '!text-white'
                },
                inactiveButton: {
                  color: 'white',
                  variant: 'outline',
                  class: '!text-slate-700 !border-slate-300 hover:!bg-violet-50 hover:!border-violet-300'
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
  </div>
</template>

<script setup lang="ts">
import type { AppointmentAdmin } from "@/types/appointments";

useHead({
  title: "Appointments – Clinic Admin"
});

const toast = useToast();
const { fetcher, request } = useAdminApi();
const router = useRouter();
const route = useRoute();

const selectPaddingUi = {
  trailing: {
    padding: {
      sm: "pe-12",
      md: "pe-12",
      lg: "pe-12"
    }
  }
};

const filter = ref<"upcoming" | "week">("upcoming");
const filterOptions = [
  { value: "upcoming", label: "Next 20" },
  { value: "week", label: "Next 7 days" }
];

// Get query parameters
const doctorIdQuery = computed(() => route.query.doctorId ? String(route.query.doctorId) : null);
const patientIdQuery = computed(() => route.query.patientId ? String(route.query.patientId) : null);

// Pagination state
const page = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const { data, pending, refresh: baseRefresh } = await useAsyncData(
  () => `admin-appointments-${filter.value}-page-${page.value}-doctor-${doctorIdQuery.value}-patient-${patientIdQuery.value}`,
  () => fetchAppointments()
);

watch(filter, async () => {
  page.value = 1; // Reset to first page when filter changes
  try {
    await baseRefresh();
  } catch (error: any) {
    toast.add({
      title: "Unable to load appointments",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  }
});

watch(page, async () => {
  try {
    await baseRefresh();
  } catch (error: any) {
    toast.add({
      title: "Unable to load appointments",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  }
});

// Watch for query parameter changes
watch([doctorIdQuery, patientIdQuery], async () => {
  page.value = 1; // Reset to first page when filters change
  try {
    await baseRefresh();
  } catch (error: any) {
    toast.add({
      title: "Unable to load appointments",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  }
});

async function fetchAppointments() {
  // Build query string
  let queryParams = `filter=${filter.value}&page=${page.value - 1}&size=${pageSize.value}`;

  if (doctorIdQuery.value) {
    queryParams += `&doctorId=${doctorIdQuery.value}`;
  }

  if (patientIdQuery.value) {
    queryParams += `&patientId=${patientIdQuery.value}`;
  }

  const response = await fetcher<any>(
    `/appointments?${queryParams}`,
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
      title: "Unable to refresh schedule",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  }
}

const appointments = computed(() => data.value ?? []);

const completedCount = computed(() =>
  appointments.value.filter(appointment => appointment.status === "COMPLETED").length.toString()
);

const pendingCount = computed(() =>
  appointments.value.filter(appointment => appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED").length.toString()
);

const search = ref("");
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium"
});
const timeFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: "short"
});

const rows = computed(() =>
  appointments.value.map(appointment => {
    const scheduledAt = appointment.scheduledAt
      ? dateFormatter.format(new Date(appointment.scheduledAt))
      : "—";
    return {
      ...appointment,
      scheduledAtRaw: appointment.scheduledAt,
      scheduledAt,
      bookingModeLabel: formatMode(appointment.bookingMode)
    };
  })
);

const filteredRows = computed(() => {
  if (!search.value.trim()) {
    return rows.value;
  }
  const term = search.value.toLowerCase();
  return rows.value.filter(row =>
    [row.patientName, row.doctorName, row.serviceName, row.status, row.bookingModeLabel]
      .filter(Boolean)
      .some(value => value?.toLowerCase().includes(term))
  );
});

const columns = [
  { key: "patientName", label: "Patient", sortable: true, class: "min-w-[250px]" },
  { key: "doctorName", label: "Doctor", class: "min-w-[200px]" },
  { key: "bookingMode", label: "Mode", class: "w-44" },
  { key: "status", label: "Status", class: "w-40" },
  { key: "scheduledAt", label: "Scheduled", class: "min-w-[180px]" },
  { key: "actions", label: "Actions", class: "w-44 text-right" }
];

const activeFilterLabel = computed(() => {
  const current = filterOptions.find(option => option.value === filter.value);
  return current ? current.label : "Upcoming";
});

function formatDate(date: string | number) {
  return dateFormatter.format(new Date(date));
}

function formatTime(date: string | number) {
  return timeFormatter.format(new Date(date));
}

function openCreate() {
  router.push("/appointments/new");
}

function openDetails(row: AppointmentAdmin) {
  router.push(`/appointments/${row.id}`);
}

const approveLoadingId = ref<number | null>(null);
const declineLoadingId = ref<number | null>(null);

function canApprove(status: string | undefined) {
  return status === "SCHEDULED";
}

function canDecline(status: string | undefined) {
  return status === "SCHEDULED" || status === "CONFIRMED";
}

async function approveAppointment(row: AppointmentAdmin) {
  if (!canApprove(row.status) || approveLoadingId.value === row.id) return;
  approveLoadingId.value = row.id;
  try {
    await request(`/appointments/${row.id}/approve`, { method: "POST" });
    toast.add({ title: "Appointment approved" });
    await baseRefresh();
  } catch (error: any) {
    toast.add({
      title: "Unable to approve",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    approveLoadingId.value = null;
  }
}

async function declineAppointment(row: AppointmentAdmin) {
  if (!canDecline(row.status) || declineLoadingId.value === row.id) return;
  declineLoadingId.value = row.id;
  try {
    await request(`/appointments/${row.id}/decline`, { method: "POST" });
    toast.add({ title: "Appointment declined" });
    await baseRefresh();
  } catch (error: any) {
    toast.add({
      title: "Unable to decline",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    declineLoadingId.value = null;
  }
}

function statusColor(status: string | undefined) {
  switch (status) {
    case "CONFIRMED":
      return "emerald";
    case "COMPLETED":
      return "blue";
    case "CANCELLED":
      return "red";
    case "SCHEDULED":
    default:
      return "violet";
  }
}

function formatStatus(status: string | undefined) {
  if (!status) return "";
  return status
    .toLowerCase()
    .split("_")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatMode(mode: string | undefined) {
  switch (mode) {
    case "VIRTUAL_CONSULTATION":
      return "Virtual Consultation";
    case "CLINIC_VISIT":
    default:
      return "Clinic Visit";
  }
}

function modeColor(mode: string | undefined) {
  return mode === "VIRTUAL_CONSULTATION" ? "blue" : "violet";
}

function statusIcon(status: string | undefined) {
  switch (status) {
    case "CONFIRMED":
      return "i-lucide-check-circle";
    case "COMPLETED":
      return "i-lucide-circle-check-big";
    case "CANCELLED":
      return "i-lucide-x-circle";
    case "SCHEDULED":
    default:
      return "i-lucide-calendar-clock";
  }
}

function clearDoctorFilter() {
  const query = { ...route.query };
  delete query.doctorId;
  router.push({ path: route.path, query });
}

function clearPatientFilter() {
  const query = { ...route.query };
  delete query.patientId;
  router.push({ path: route.path, query });
}
</script>
