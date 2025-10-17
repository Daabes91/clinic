<template>
  <div class="space-y-8">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 p-8 text-white shadow-xl">
      <div class="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-violet-400/20 blur-2xl"></div>

      <div class="relative space-y-6">
        <UBreadcrumb
          :links="[
            { label: 'Appointments', to: '/appointments' },
            { label: formatStatus(appointment?.status) || 'Loading' }
          ]"
          class="text-violet-100"
        />

        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <UBadge :color="statusColor" variant="soft" size="md" class="backdrop-blur">
                <UIcon name="i-lucide-badge-check" class="h-3.5 w-3.5" />
                {{ formatStatus(appointment?.status) || "Status" }}
              </UBadge>
              <UBadge :color="bookingModeColor" variant="soft" size="md" class="backdrop-blur">
                <UIcon :name="bookingModeIcon" class="h-3.5 w-3.5" />
                {{ bookingModeLabel || 'Booking Mode' }}
              </UBadge>
            </div>
            <h1 class="text-3xl font-bold lg:text-4xl">
              {{ pageTitle }}
            </h1>
            <p class="max-w-2xl text-violet-100">
              Review and update the booking details for this visit. Any changes sync instantly for the care team.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <UButton variant="ghost" color="white" class="hover:bg-white/20" @click="router.push('/appointments')">
              Back to appointments
            </UButton>
            <UButton
              color="white"
              class="!text-emerald-600 shadow-sm hover:bg-white"
              :disabled="!canApprove || approving"
              :loading="approving"
              @click="handleApprove"
            >
              <span class="text-emerald-600 font-medium">Approve</span>
            </UButton>
            <UButton
              color="white"
              variant="soft"
              class="!text-red-600 hover:bg-white/80"
              :disabled="!canDecline || declining"
              :loading="declining"
              @click="handleDecline"
            >
              <span class="text-red-600 font-medium">Decline</span>
            </UButton>
            <UButton
              variant="ghost"
              color="white"
              class="hover:bg-white/10"
              :loading="deleting"
              @click="deleteConfirmOpen = true"
            >
              Delete
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <UAlert v-if="error" color="red" icon="i-lucide-alert-triangle">
      <template #title>Unable to load appointment</template>
      <template #description>
        {{ error.message || "We couldn't find that appointment. Return to the overview and try again." }}
      </template>
    </UAlert>

    <div v-else>
      <div v-if="pending" class="space-y-6">
        <USkeleton class="h-64 rounded-2xl" />
        <USkeleton class="h-48 rounded-2xl" />
      </div>

      <UForm v-else :state="form" class="space-y-6" @submit.prevent="handleSave">
        <div class="grid gap-6 lg:grid-cols-3">
          <!-- Main Content - Assignment Details -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Assignment Card -->
            <UCard class="shadow-card">
              <template #header>
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                    <UIcon name="i-lucide-calendar-check" class="h-5 w-5" />
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-slate-900">Assignment Details</h2>
                    <p class="text-sm text-slate-500">
                      Update the booking details for this visit and ensure the right patient, service, and provider are linked.
                    </p>
                  </div>
                </div>
              </template>

              <div class="space-y-6">
                <div class="grid gap-5 md:grid-cols-2">
                  <UFormGroup label="Patient" required>
                    <USelect
                      v-model="form.patientId"
                      :options="patientOptions"
                      option-attribute="label"
                      value-attribute="value"
                      placeholder="Select patient"
                      :ui="selectPaddingUi"
                    />
                  </UFormGroup>
                  <UFormGroup label="Service" required>
                    <USelect
                      v-model="form.serviceId"
                      :options="serviceOptions"
                      option-attribute="label"
                      value-attribute="value"
                      placeholder="Select service"
                      :ui="selectPaddingUi"
                    />
                  </UFormGroup>
                </div>

                <div class="grid gap-5 md:grid-cols-2">
                  <UFormGroup label="Doctor" required>
                    <USelect
                      v-model="form.doctorId"
                      :options="doctorOptions"
                      option-attribute="label"
                      value-attribute="value"
                      placeholder="Select doctor"
                      :ui="selectPaddingUi"
                    />
                    <template #help v-if="!doctorOptions.length">
                      <div class="flex items-center gap-2 text-amber-600">
                        <UIcon name="i-lucide-alert-triangle" class="h-3.5 w-3.5" />
                        <span>No doctors provide the selected service. Choose another service first.</span>
                      </div>
                    </template>
                  </UFormGroup>
                  <UFormGroup label="Booking Mode" required>
                    <USelect
                      v-model="form.bookingMode"
                      :options="bookingModeOptions"
                      option-attribute="label"
                      value-attribute="value"
                      :ui="selectPaddingUi"
                    />
                  </UFormGroup>
                </div>

                <div class="grid gap-5 md:grid-cols-2">
                  <UFormGroup label="Scheduled Time" hint="Local clinic time" required>
                    <UInput v-model="form.scheduledAt" type="datetime-local" step="1800" />
                  </UFormGroup>
                </div>
              </div>
            </UCard>

            <!-- Internal Notes Card -->
            <UCard class="shadow-card">
              <template #header>
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <UIcon name="i-lucide-file-text" class="h-5 w-5" />
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-slate-900">Internal Notes</h2>
                    <p class="text-sm text-slate-500">
                      Document preparation instructions or context for clinic staff and providers.
                    </p>
                  </div>
                </div>
              </template>

              <UTextarea
                v-model="form.notes"
                :rows="4"
                placeholder="Optional notes visible to clinic staff..."
              />
            </UCard>
          </div>

          <!-- Sidebar - Appointment Info -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Quick Info Card -->
            <UCard class="shadow-card">
              <template #header>
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <UIcon name="i-lucide-info" class="h-5 w-5" />
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-slate-900">Quick Info</h3>
                  </div>
                </div>
              </template>

              <div class="space-y-4">
                <div class="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                  <UIcon name="i-lucide-user" class="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-600" />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-medium text-slate-500">Patient</p>
                    <p class="mt-0.5 text-sm font-semibold text-slate-900">{{ appointment?.patient?.name || 'Not assigned' }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                  <UIcon name="i-lucide-stethoscope" class="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-600" />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-medium text-slate-500">Doctor</p>
                    <p class="mt-0.5 text-sm font-semibold text-slate-900">{{ appointment?.doctor?.name || 'Not assigned' }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                  <UIcon name="i-lucide-clipboard-list" class="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-600" />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-medium text-slate-500">Service</p>
                    <p class="mt-0.5 text-sm font-semibold text-slate-900">{{ appointment?.service?.name || 'Not assigned' }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                  <UIcon name="i-lucide-clock" class="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-600" />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-medium text-slate-500">Scheduled Time</p>
                    <p class="mt-0.5 text-sm font-semibold text-slate-900">{{ formatDateTime(appointment?.scheduledAt) }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                  <UIcon name="i-lucide-badge-check" class="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-600" />
                  <div class="min-w-0 flex-1">
                    <p class="text-xs font-medium text-slate-500">Status</p>
                    <div class="mt-1">
                      <UBadge :color="statusColor" variant="soft" size="sm">
                        {{ formatStatus(appointment?.status) }}
                      </UBadge>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- Actions Card -->
            <UCard class="shadow-card">
              <template #header>
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <UIcon name="i-lucide-zap" class="h-5 w-5" />
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-slate-900">Quick Actions</h3>
                  </div>
                </div>
              </template>

              <div class="space-y-3">
                <UButton
                  block
                  color="emerald"
                  variant="soft"
                  :disabled="!canApprove || approving"
                  :loading="approving"
                  @click="handleApprove"
                >
                  <UIcon name="i-lucide-check-circle" class="h-4 w-4" />
                  Approve Appointment
                </UButton>

                <UButton
                  block
                  color="red"
                  variant="soft"
                  :disabled="!canDecline || declining"
                  :loading="declining"
                  @click="handleDecline"
                >
                  <UIcon name="i-lucide-x-circle" class="h-4 w-4" />
                  Decline Appointment
                </UButton>

                <UButton
                  block
                  color="gray"
                  variant="outline"
                  :loading="deleting"
                  @click="deleteConfirmOpen = true"
                >
                  <UIcon name="i-lucide-trash-2" class="h-4 w-4" />
                  Delete Appointment
                </UButton>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3">
          <UButton
            type="button"
            variant="outline"
            color="gray"
            size="lg"
            :disabled="saving"
            @click="router.push('/appointments')"
          >
            Cancel
          </UButton>
          <UButton
            type="submit"
            color="violet"
            size="lg"
            :loading="saving"
          >
            <UIcon name="i-lucide-save" class="h-5 w-5" />
            Save Changes
          </UButton>
        </div>
      </UForm>
    </div>

    <UModal v-model="deleteConfirmOpen">
      <UCard>
        <template #header>
          <div>
            <p class="text-sm font-medium text-red-600">Delete appointment</p>
            <h3 class="text-lg font-semibold text-slate-900">This action cannot be reversed</h3>
          </div>
        </template>
        <p class="text-sm text-slate-600">
          Are you sure you want to delete this appointment?
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <UButton variant="ghost" color="gray" :disabled="deleting" @click="deleteConfirmOpen = false">
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
import type { AppointmentAdminDetail } from "@/types/appointments";
import type { PatientAdmin } from "@/types/patients";
import type { DoctorAdmin } from "@/types/doctors";
import type { AdminServiceSummary } from "@/types/services";

const toast = useToast();
const router = useRouter();
const route = useRoute();
const { fetcher, request } = useAdminApi();
const selectPaddingUi = {
  trailing: {
    padding: {
      sm: "pe-12",
      md: "pe-12",
      lg: "pe-12"
    }
  }
};
const bookingModeOptions = [
  { value: "CLINIC_VISIT", label: "Clinic Visit" },
  { value: "VIRTUAL_CONSULTATION", label: "Virtual Consultation" }
];

useHead({
  title: "Appointment Details – Clinic Admin"
});

const appointmentId = computed(() => Number(route.params.id));
if (Number.isNaN(appointmentId.value)) {
  throw createError({ statusCode: 404, statusMessage: "Appointment not found" });
}

const { data: patientsData } = await useAsyncData("admin-appointment-patients", () =>
  fetcher<PatientAdmin[]>("/patients", [])
);
const { data: doctorsData } = await useAsyncData("admin-appointment-doctors", () =>
  fetcher<DoctorAdmin[]>("/doctors", [])
);
const { data: servicesData } = await useAsyncData("admin-appointment-services", () =>
  fetcher<AdminServiceSummary[]>("/services", [])
);

const { data, pending, error, refresh } = await useAsyncData(
  `admin-appointment-${appointmentId.value}`,
  () => request<AppointmentAdminDetail>(`/appointments/${appointmentId.value}`)
);

const appointment = computed(() => data.value ?? null);

const patients = computed(() => patientsData.value ?? []);
const doctors = computed(() => doctorsData.value ?? []);
const services = computed(() => servicesData.value ?? []);

const form = reactive({
  patientId: null as string | null,
  doctorId: null as string | null,
  serviceId: null as string | null,
  bookingMode: "CLINIC_VISIT",
  scheduledAt: "",
  notes: ""
});

watchEffect(() => {
  if (!appointment.value) return;
  form.patientId = appointment.value.patient?.id != null ? appointment.value.patient.id.toString() : null;
  form.doctorId = appointment.value.doctor?.id != null ? appointment.value.doctor.id.toString() : null;
  form.serviceId = appointment.value.service?.id != null ? appointment.value.service.id.toString() : null;
  form.bookingMode = appointment.value.bookingMode ?? "CLINIC_VISIT";
  form.scheduledAt = appointment.value.scheduledAt ? appointment.value.scheduledAt.slice(0, 16) : "";
  form.notes = appointment.value.notes ?? "";
});

const patientOptions = computed(() =>
  patients.value.map(patient => ({
    label: `${patient.firstName} ${patient.lastName}`,
    value: patient.id.toString()
  }))
);

const serviceOptions = computed(() =>
  services.value.map(service => ({
    label: service.nameEn ?? service.nameAr ?? service.slug,
    value: service.id.toString()
  }))
);

const doctorOptions = computed(() => {
  const selectedService = form.serviceId ? Number(form.serviceId) : null;
  return doctors.value
    .filter(doctor => (selectedService ? doctor.services.some(service => service.id === selectedService) : true))
    .map(doctor => ({
      label: doctor.fullName,
      value: doctor.id.toString()
    }));
});

const saving = ref(false);
const approving = ref(false);
const declining = ref(false);
const deleting = ref(false);
const deleteConfirmOpen = ref(false);

const canApprove = computed(() => appointment.value?.status === "SCHEDULED");
const canDecline = computed(() => appointment.value ? appointment.value.status === "SCHEDULED" || appointment.value.status === "CONFIRMED" : false);

const statusColor = computed(() => {
  switch (appointment.value?.status) {
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
});

const bookingModeColor = computed(() =>
  appointment.value?.bookingMode === "VIRTUAL_CONSULTATION" ? "blue" : "violet"
);

const bookingModeIcon = computed(() =>
  appointment.value?.bookingMode === "VIRTUAL_CONSULTATION" ? "i-lucide-video" : "i-lucide-building-2"
);

const bookingModeLabel = computed(() => formatMode(appointment.value?.bookingMode));

const pageTitle = computed(() =>
  appointment.value?.patient?.name
    ? `${appointment.value.patient.name} with ${appointment.value.doctor?.name ?? 'TBD'}`
    : "Appointment details"
);

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

function formatDateTime(dateTimeString: string | undefined) {
  if (!dateTimeString) return "Not scheduled";
  try {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(date);
  } catch {
    return "Invalid date";
  }
}

async function handleSave() {
  if (!appointment.value) return;
  saving.value = true;
  try {
    await request(`/appointments/${appointment.value.id}`, {
      method: "PUT",
      body: {
        patientId: form.patientId ? Number(form.patientId) : null,
        doctorId: form.doctorId ? Number(form.doctorId) : null,
        serviceId: form.serviceId ? Number(form.serviceId) : null,
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
        bookingMode: form.bookingMode,
        notes: form.notes.trim() || null
      }
    });
    toast.add({ title: "Appointment updated" });
    await refresh();
  } catch (error: any) {
    toast.add({
      title: "Unable to update appointment",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    saving.value = false;
  }
}

async function handleApprove() {
  if (!appointment.value || !canApprove.value) return;
  approving.value = true;
  try {
    await request(`/appointments/${appointment.value.id}/approve`, { method: "POST" });
    toast.add({ title: "Appointment approved" });
    await refresh();
  } catch (error: any) {
    toast.add({
      title: "Unable to approve appointment",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    approving.value = false;
  }
}

async function handleDecline() {
  if (!appointment.value || !canDecline.value) return;
  declining.value = true;
  try {
    await request(`/appointments/${appointment.value.id}/decline`, { method: "POST" });
    toast.add({ title: "Appointment declined" });
    await refresh();
  } catch (error: any) {
    toast.add({
      title: "Unable to decline appointment",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    declining.value = false;
  }
}

async function handleDelete() {
  if (!appointment.value) return;
  deleting.value = true;
  try {
    await request(`/appointments/${appointment.value.id}`, { method: "DELETE" });
    toast.add({ title: "Appointment deleted" });
    router.push("/appointments");
  } catch (error: any) {
    toast.add({
      title: "Unable to delete appointment",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    deleting.value = false;
  }
}
</script>
