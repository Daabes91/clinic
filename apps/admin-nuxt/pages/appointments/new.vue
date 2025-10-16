<template>
  <UPage>
    <UPageHeader
      title="Schedule a new visit"
      description="Choose a patient, doctor, and service to add an appointment to the clinic calendar."
      :breadcrumbs="[
        { label: 'Appointments', to: '/appointments' },
        { label: 'New appointment' }
      ]"
    >
      <template #actions>
        <UButton variant="ghost" color="gray" @click="router.push('/appointments')">
          Cancel
        </UButton>
      </template>
    </UPageHeader>

    <UPageBody>
      <UForm :state="form" class="space-y-8" @submit.prevent="handleSave">
        <UPageSection>
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
            <UField label="Date" hint="Clinic local date" required>
              <UInput v-model="form.date" type="date" />
            </UField>
          </div>
        </UPageSection>

        <UPageSection title="Available slots" description="Select a 30-minute block that fits the patient's request.">
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-500">
              {{ canLoadSlots ? 'Times are shown in clinic local time.' : 'Select service, doctor, and date to load availability.' }}
            </span>
            <UButton
              variant="ghost"
              color="gray"
              size="xs"
              :disabled="slotsLoading || !canLoadSlots"
              :loading="slotsLoading"
              @click="loadSlots"
            >
              Refresh
            </UButton>
          </div>

          <UAlert v-if="slotError" color="red" icon="i-lucide-alert-triangle" class="mt-4">
            <template #title>Unable to fetch availability</template>
            <template #description>{{ slotError }}</template>
          </UAlert>

          <div v-if="slotsLoading" class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <USkeleton v-for="i in 6" :key="`slot-skeleton-${i}`" class="h-14 rounded-xl" />
          </div>

          <div v-else-if="canLoadSlots && !slotOptions.length" class="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            No available slots for this day. Try another date or adjust doctor/service.
          </div>

          <URadioGroup
            v-else-if="slotOptions.length"
            v-model="selectedSlot"
            class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            <URadio
              v-for="slot in slotOptions"
              :key="slot.value"
              :value="slot.value"
              class="group"
            >
              <UCard
                :class="[
                  'h-16 cursor-pointer border transition group-data-[checked=true]:border-primary-300 group-data-[checked=true]:bg-primary-50',
                  selectedSlot === slot.value ? 'ring-2 ring-primary-200' : ''
                ]"
              >
                <p class="text-sm font-semibold text-slate-900">{{ slot.label }}</p>
                <p class="text-xs text-slate-500">{{ slot.range }}</p>
              </UCard>
            </URadio>
          </URadioGroup>
        </UPageSection>

        <UPageSection>
          <UField label="Notes">
            <UTextarea
              v-model="form.notes"
              :rows="4"
              placeholder="Optional notes visible to clinic staff"
            />
          </UField>
        </UPageSection>

        <UPageSection>
          <div class="flex justify-end gap-3">
            <UButton type="button" variant="ghost" color="gray" :disabled="saving" @click="router.push('/appointments')">
              Cancel
            </UButton>
            <UButton type="submit" :loading="saving">
              Create appointment
            </UButton>
          </div>
        </UPageSection>
      </UForm>
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
import type { AppointmentAdminDetail, AvailabilitySlot } from "@/types/appointments";
import type { PatientAdmin } from "@/types/patients";
import type { DoctorAdmin } from "@/types/doctors";
import type { AdminServiceSummary } from "@/types/services";

const toast = useToast();
const router = useRouter();
const { fetcher, request } = useAdminApi();

useHead({
  title: "New Appointment – Clinic Admin"
});

const { data: patientsData } = await useAsyncData("admin-appointment-patients", () =>
  fetcher<PatientAdmin[]>("/patients", [])
);
const { data: doctorsData } = await useAsyncData("admin-appointment-doctors", () =>
  fetcher<DoctorAdmin[]>("/doctors", [])
);
const { data: servicesData } = await useAsyncData("admin-appointment-services", () =>
  fetcher<AdminServiceSummary[]>("/services", [])
);

const patients = computed(() => patientsData.value ?? []);
const doctors = computed(() => doctorsData.value ?? []);
const services = computed(() => servicesData.value ?? []);

const patientOptions = computed(() =>
  patients.value.map(patient => ({
    label: `${patient.firstName} ${patient.lastName}`,
    value: patient.id
  }))
);

const form = reactive({
  patientId: null as number | null,
  doctorId: null as number | null,
  serviceId: null as number | null,
  date: "",
  notes: ""
});

const selectedSlot = ref<string>("");
const slotsLoading = ref(false);
const slotError = ref<string | null>(null);
const availabilitySlots = ref<AvailabilitySlot[]>([]);

const saving = ref(false);

const serviceOptions = computed(() =>
  services.value.map(service => ({
    label: service.nameEn ?? service.nameAr ?? service.slug,
    value: service.id
  }))
);

const doctorOptions = computed(() => {
  const selectedService = form.serviceId;
  return doctors.value
    .filter(doctor =>
      selectedService ? doctor.services.some(service => service.id === selectedService) : true
    )
    .map(doctor => ({
      label: doctor.fullName,
      value: doctor.id
    }));
});

watch(
  () => form.serviceId,
  serviceId => {
    if (!serviceId) return;
    const doctorMatchesService = doctorOptions.value.some(option => option.value === form.doctorId);
    if (!doctorMatchesService) {
      form.doctorId = null;
    }
    resetSlots();
  }
);

watch(
  () => form.doctorId,
  () => {
    resetSlots(false);
    if (canLoadSlots.value) {
      loadSlots();
    }
  }
);

watch(
  () => form.date,
  () => {
    resetSlots(false);
    if (canLoadSlots.value) {
      loadSlots();
    }
  }
);

const serviceSlugById = computed(() => {
  const map = new Map<number, string>();
  services.value.forEach(service => map.set(service.id, service.slug));
  return map;
});

const slotFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit"
});

const slotOptions = computed(() =>
  availabilitySlots.value.map(slot => {
    const start = new Date(slot.start);
    const end = new Date(slot.end);
    return {
      value: slot.start,
      label: slotFormatter.format(start),
      range: `${slotFormatter.format(start)} – ${slotFormatter.format(end)}`
    };
  })
);

const canLoadSlots = computed(() => Boolean(form.serviceId && form.doctorId && form.date));

function resetSlots(clearDate = true) {
  availabilitySlots.value = [];
  selectedSlot.value = "";
  slotError.value = null;
  if (clearDate) {
    form.date = "";
  }
}

async function loadSlots() {
  if (!canLoadSlots.value) return;
  if (!form.serviceId || !form.doctorId || !form.date) return;

  slotsLoading.value = true;
  slotError.value = null;
  try {
    const serviceSlug = serviceSlugById.value.get(form.serviceId);
    if (!serviceSlug) {
      throw new Error("Unable to resolve service slug");
    }

    availabilitySlots.value = await request<AvailabilitySlot[]>(`/doctors/${form.doctorId}/availability/slots`, {
      method: "POST",
      body: {
        serviceSlug,
        date: form.date
      }
    });
    const existing = availabilitySlots.value.find(slot => slot.start === selectedSlot.value);
    selectedSlot.value = existing ? existing.start : availabilitySlots.value.length ? availabilitySlots.value[0].start : "";
  } catch (error: any) {
    slotError.value = error?.data?.message ?? error?.message ?? "Unexpected error";
    availabilitySlots.value = [];
  } finally {
    slotsLoading.value = false;
  }
}

async function handleSave() {
  if (!form.patientId || !form.doctorId || !form.serviceId || !form.date || !selectedSlot.value) {
    toast.add({
      title: "Missing information",
      description: "Patient, doctor, service, date, and slot are required.",
      color: "red"
    });
    return;
  }

  saving.value = true;

  const payload = {
    patientId: form.patientId,
    doctorId: form.doctorId,
    serviceId: form.serviceId,
    scheduledAt: selectedSlot.value,
    notes: form.notes.trim() || null
  };

  try {
    const response = await request<AppointmentAdminDetail>("/appointments", {
      method: "POST",
      body: payload
    });

    toast.add({ title: "Appointment created" });
    const createdId = response?.id;
    if (createdId) {
      router.push(`/appointments/${createdId}`);
    } else {
      router.push("/appointments");
    }
  } catch (error: any) {
    toast.add({
      title: "Unable to create appointment",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    saving.value = false;
  }
}
</script>
