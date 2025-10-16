<template>
  <UPage>
    <UPageHeader>
      <template #title>Appointments overview</template>
      <template #description>
        Monitor upcoming visits, doctor schedules, and service utilization in one place.
      </template>
      <template #actions>
        <div class="flex items-center gap-2">
          <USelectMenu
            v-model="filter"
            :options="filterOptions"
            value-attribute="value"
            option-attribute="label"
            size="md"
            class="min-w-[160px]"
          />
          <UButton variant="ghost" :loading="pending" @click="refresh">
            Refresh
          </UButton>
          <UButton icon="i-lucide-calendar-plus" @click="openCreate">
            New appointment
          </UButton>
        </div>
      </template>
    </UPageHeader>

    <UPageBody>
      <UPageSection>
        <div class="grid gap-4 sm:grid-cols-3">
          <MetricCard
            title="Total upcoming"
            :metric="appointments.length.toString()"
            change="Within window"
            description="Appointments in the selected range"
          />
          <MetricCard
            title="Completed"
            :metric="completedCount"
            change="Historic"
            description="Marked as completed"
          />
          <MetricCard
            title="Pending"
            :metric="pendingCount"
            change="Awaiting visit"
            description="Scheduled or confirmed"
          />
        </div>
      </UPageSection>

      <UPageSection>
        <UCard>
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-widest text-slate-400">Schedule</p>
                <h2 class="text-lg font-semibold text-slate-900">Appointment list</h2>
                <p class="text-sm text-slate-500">Showing up to 20 appointments based on the selected filter.</p>
              </div>
              <UInput
                v-model="search"
                icon="i-lucide-search"
                placeholder="Search by patient, doctor, or service"
                class="w-full max-w-md"
              />
            </div>
          </template>

          <div v-if="pending && !appointments.length" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <USkeleton v-for="i in 6" :key="`appt-skeleton-${i}`" class="h-16 rounded-xl" />
          </div>

          <div v-else-if="!filteredRows.length" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
            <div class="mx-auto max-w-md space-y-4">
              <UAvatar icon="i-lucide-calendar-range" size="xl" class="mx-auto" color="gray" variant="soft" />
              <h3 class="text-xl font-semibold text-slate-900">No appointments found</h3>
              <p class="text-sm text-slate-500">
                Adjust the filter or refresh the schedule to see upcoming visits.
              </p>
            </div>
          </div>

          <UTable
            v-else
            :rows="filteredRows"
            :columns="columns"
            :loading="pending"
            class="rounded-2xl"
          >
            <template #patientName-data="{ row }">
              <div class="flex flex-col">
                <span class="font-medium text-slate-900">{{ row.patientName }}</span>
                <span class="text-xs text-slate-500">{{ row.serviceName }}</span>
              </div>
            </template>
            <template #doctorName-data="{ row }">
              <span class="text-sm text-slate-700">{{ row.doctorName }}</span>
            </template>
            <template #status-data="{ row }">
              <UBadge :color="statusColor(row.status)" variant="soft" class="uppercase tracking-wide">
                {{ formatStatus(row.status) }}
              </UBadge>
            </template>
            <template #scheduledAt-data="{ row }">
              <span class="text-xs text-slate-500">{{ row.scheduledAt }}</span>
            </template>
            <template #actions-data="{ row }">
              <div class="flex justify-end gap-2">
                <UButton
                  v-if="canApprove(row.status)"
                  icon="i-lucide-check"
                  variant="ghost"
                  color="emerald"
                  size="xs"
                  :disabled="approveLoadingId === row.id"
                  :loading="approveLoadingId === row.id"
                  aria-label="Approve"
                  @click="approveAppointment(row)"
                />
                <UButton
                  v-if="canDecline(row.status)"
                  icon="i-lucide-x"
                  variant="ghost"
                  color="red"
                  size="xs"
                  :disabled="declineLoadingId === row.id"
                  :loading="declineLoadingId === row.id"
                  aria-label="Decline"
                  @click="declineAppointment(row)"
                />
                <UButton
                  icon="i-lucide-eye"
                  variant="ghost"
                  color="gray"
                  size="xs"
                  aria-label="View details"
                  @click="openDetails(row)"
                />
              </div>
            </template>
          </UTable>
        </UCard>
      </UPageSection>
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
import type { AppointmentAdmin } from "@/types/appointments";

useHead({
  title: "Appointments – Clinic Admin"
});

const toast = useToast();
const { fetcher, request } = useAdminApi();
const router = useRouter();

const filter = ref<"upcoming" | "week">("upcoming");
const filterOptions = [
  { value: "upcoming", label: "Next 20" },
  { value: "week", label: "Next 7 days" }
];

const { data, pending, refresh: baseRefresh } = await useAsyncData(
  () => `admin-appointments-${filter.value}`,
  () => fetchAppointments()
);

watch(filter, async () => {
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
  return await fetcher<AppointmentAdmin[]>(`/appointments?filter=${filter.value}`, []);
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
  dateStyle: "medium",
  timeStyle: "short"
});

const rows = computed(() =>
  appointments.value.map(appointment => ({
    ...appointment,
    scheduledAt: appointment.scheduledAt ? dateFormatter.format(new Date(appointment.scheduledAt)) : "—"
  }))
);

const filteredRows = computed(() => {
  if (!search.value.trim()) {
    return rows.value;
  }
  const term = search.value.toLowerCase();
  return rows.value.filter(row =>
    [row.patientName, row.doctorName, row.serviceName, row.status]
      .filter(Boolean)
      .some(value => value?.toLowerCase().includes(term))
  );
});

const columns = [
  { key: "patientName", label: "Patient", sortable: true },
  { key: "doctorName", label: "Doctor", class: "max-w-xs" },
  { key: "status", label: "Status", class: "w-32" },
  { key: "scheduledAt", label: "Scheduled" },
  { key: "actions", label: "", class: "w-24 text-right" }
];

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
</script>
