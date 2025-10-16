<template>
  <UPage>
    <UPageHeader
      :title="pageTitle"
      description="Appointment details"
      :breadcrumbs="[
        { label: 'Appointments', to: '/appointments' },
        { label: formatStatus(appointment?.status) || 'Loading' }
      ]"
      :badge="{ label: formatStatus(appointment?.status), color: statusColor }"
    >
      <template #actions>
        <div class="flex flex-wrap gap-2">
          <UButton variant="ghost" color="gray" @click="router.push('/appointments')">
            Back to appointments
          </UButton>
          <UButton
            color="emerald"
            :disabled="!canApprove || approving"
            :loading="approving"
            @click="handleApprove"
          >
            Approve
          </UButton>
          <UButton
            color="red"
            variant="soft"
            :disabled="!canDecline || declining"
            :loading="declining"
            @click="handleDecline"
          >
            Decline
          </UButton>
          <UButton
            color="red"
            variant="ghost"
            :loading="deleting"
            @click="deleteConfirmOpen = true"
          >
            Delete
          </UButton>
        </div>
      </template>
    </UPageHeader>

    <UPageBody>
      <UAlert v-if="error" color="red" icon="i-lucide-alert-triangle">
        <template #title>Unable to load appointment</template>
        <template #description>
          {{ error.message || "We couldn't find that appointment. Return to the overview and try again." }}
        </template>
      </UAlert>

      <div v-else>
        <USkeleton v-if="pending" class="rounded-2xl border border-slate-200" height="320" />

        <UForm v-else :state="form" class="space-y-8" @submit.prevent="handleSave">
          <UPageSection title="Assignment" description="Update the booking details for this visit.">
            <div class="grid gap-5 md:grid-cols-2">
              <UField label="Patient" required>
                <USelectMenu
                  v-model="form.patientId"
                  :options="patientOptions"
                  option-attribute="label"
                  value-attribute="value"
                  searchable
                  placeholder="Select patient"
                />
              </UField>
              <UField label="Service" required>
                <USelectMenu
                  v-model="form.serviceId"
                  :options="serviceOptions"
                  option-attribute="label"
                  value-attribute="value"
                  searchable
                  placeholder="Select service"
                />
              </UField>
            </div>

            <div class="mt-6 grid gap-5 md:grid-cols-2">
              <UField label="Doctor" required>
                <USelectMenu
                  v-model="form.doctorId"
                  :options="doctorOptions"
                  option-attribute="label"
                  value-attribute="value"
                  searchable
                  placeholder="Select doctor"
                />
                <template #help v-if="!doctorOptions.length">
                  No doctors provide the selected service. Choose another service first.
                </template>
              </UField>
              <UField label="Scheduled time" hint="Local clinic time" required>
                <UInput v-model="form.scheduledAt" type="datetime-local" step="1800" />
              </UField>
            </div>
          </UPageSection>

          <UPageSection title="Notes">
            <UTextarea
              v-model="form.notes"
              :rows="4"
              placeholder="Optional notes visible to clinic staff"
            />
          </UPageSection>

          <UPageSection>
            <div class="flex justify-end gap-3">
              <UButton type="button" variant="ghost" color="gray" :disabled="saving" @click="router.push('/appointments')">
                Cancel
              </UButton>
              <UButton type="submit" :loading="saving">
                Save changes
              </UButton>
            </div>
          </UPageSection>
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
    </UPageBody>
  </UPage>
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
  patientId: null as number | null,
  doctorId: null as number | null,
  serviceId: null as number | null,
  scheduledAt: "",
  notes: ""
});

watchEffect(() => {
  if (!appointment.value) return;
  form.patientId = appointment.value.patient?.id ?? null;
  form.doctorId = appointment.value.doctor?.id ?? null;
  form.serviceId = appointment.value.service?.id ?? null;
  form.scheduledAt = appointment.value.scheduledAt ? appointment.value.scheduledAt.slice(0, 16) : "";
  form.notes = appointment.value.notes ?? "";
});

const patientOptions = computed(() =>
  patients.value.map(patient => ({
    label: `${patient.firstName} ${patient.lastName}`,
    value: patient.id
  }))
);

const serviceOptions = computed(() =>
  services.value.map(service => ({
    label: service.nameEn ?? service.nameAr ?? service.slug,
    value: service.id
  }))
);

const doctorOptions = computed(() => {
  const selectedService = form.serviceId;
  return doctors.value
    .filter(doctor => (selectedService ? doctor.services.some(service => service.id === selectedService) : true))
    .map(doctor => ({
      label: doctor.fullName,
      value: doctor.id
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

async function handleSave() {
  if (!appointment.value) return;
  saving.value = true;
  try {
    await request(`/appointments/${appointment.value.id}`, {
      method: "PUT",
      body: {
        patientId: form.patientId,
        doctorId: form.doctorId,
        serviceId: form.serviceId,
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
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
