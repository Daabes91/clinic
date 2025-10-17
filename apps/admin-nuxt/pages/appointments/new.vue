<template>
  <div class="space-y-6">
    <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 p-6 text-white shadow-lg">
      <div class="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-violet-400/20 blur-2xl"></div>

      <div class="relative space-y-4">
        <UBreadcrumb
          :links="[
            { label: 'Appointments', to: '/appointments' },
            { label: 'New appointment' }
          ]"
          class="text-violet-100"
        />
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div class="space-y-1.5">
            <UBadge color="white" variant="soft" size="sm" class="text-violet-700">
              <UIcon name="i-lucide-calendar-plus" class="h-3 w-3" />
              Schedule visit
            </UBadge>
            <h1 class="text-2xl font-bold lg:text-3xl">Schedule a new visit</h1>
            <p class="max-w-2xl text-sm text-violet-100">
              Choose a patient, doctor, and service to add an appointment to the clinic calendar. Availability updates live based on your selections.
            </p>
          </div>
          <UButton variant="ghost" color="white" size="sm" class="hover:bg-white/20" @click="router.push('/appointments')">
            Cancel
          </UButton>
        </div>
      </div>
    </div>

    <UForm :state="form" class="space-y-6" @submit.prevent="handleSave">
      <!-- Booking Details Card -->
      <UCard class="shadow-card">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
              <UIcon name="i-lucide-calendar-check" class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-slate-900">Booking Details</h2>
              <p class="text-sm text-slate-500">
                Match the patient with the appropriate service and provider before choosing a date.
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
            <UFormGroup label="Appointment Date" hint="Clinic local date" required>
              <div class="relative">
                <input
                  ref="dateInputRef"
                  v-model="form.date"
                  type="date"
                  :min="minDate"
                  class="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-11 pr-3 text-sm text-slate-900 transition-all duration-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 start-0 flex items-center px-3 text-violet-600 transition hover:text-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-1 focus-visible:ring-offset-white"
                  aria-label="Choose date"
                  @click="openDatePicker"
                >
                  <UIcon name="i-lucide-calendar" class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </UFormGroup>
          </div>
        </div>
      </UCard>

      <!-- Available Slots Card -->
      <UCard class="shadow-card">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <UIcon name="i-lucide-clock" class="h-5 w-5" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Available Time Slots</h2>
                <p class="text-sm text-slate-500">
                  {{ canLoadSlots ? "Times shown in clinic local time." : "Select service, doctor, booking mode, and date to load availability." }}
                </p>
              </div>
            </div>
            <UButton
              variant="ghost"
              color="gray"
              size="sm"
              :disabled="slotsLoading || !canLoadSlots"
              :loading="slotsLoading"
              @click="loadSlots"
            >
              <UIcon name="i-heroicons-arrow-path-20-solid" class="h-4 w-4" />
              Refresh
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <UAlert v-if="slotError" color="red" icon="i-lucide-alert-triangle" variant="soft">
            <template #title>Unable to fetch availability</template>
            <template #description>{{ slotError }}</template>
          </UAlert>

          <div v-if="slotsLoading" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <USkeleton v-for="i in 8" :key="`slot-skeleton-${i}`" class="h-20 rounded-xl" />
          </div>

          <ClientOnly>
            <div
              v-if="canLoadSlots && !slotsLoading && !slotOptions.length"
              class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center"
            >
              <div class="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <UIcon name="i-lucide-calendar-x" class="h-8 w-8 text-slate-400" />
              </div>
              <h3 class="mb-1 text-sm font-semibold text-slate-900">No Available Slots</h3>
              <p class="text-sm text-slate-500">
                No available slots for this day. Try another date or adjust doctor/service.
              </p>
            </div>

            <div
              v-else-if="slotOptions.length"
              class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >
              <button
                v-for="slot in slotOptions"
                :key="slot.value"
                type="button"
                @click="selectSlot(slot.value)"
                :class="[
                  'group relative overflow-hidden rounded-xl border-2 bg-white px-4 py-4 text-left shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-200 focus:ring-offset-2',
                  selectedSlot === slot.value
                    ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-200'
                    : 'border-slate-200 hover:border-violet-300 hover:bg-violet-50/50'
                ]"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-base font-semibold text-slate-900">{{ slot.label }}</p>
                    <p class="mt-0.5 text-xs text-slate-500">{{ slot.range }}</p>
                  </div>
                  <UIcon
                    v-if="selectedSlot === slot.value"
                    name="i-lucide-check"
                    class="h-5 w-5 text-violet-600"
                  />
                </div>
              </button>
            </div>
          </ClientOnly>
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
              <p class="text-sm text-slate-500">Optional notes visible to clinic staff and providers.</p>
            </div>
          </div>
        </template>

        <UTextarea
          v-model="form.notes"
          :rows="4"
          placeholder="Add context for the visit, preparation instructions, or special requests..."
        />
      </UCard>

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
          :disabled="!form.patientId || !form.doctorId || !form.serviceId || !form.date || !selectedSlot"
        >
          <UIcon name="i-lucide-calendar-plus" class="h-5 w-5" />
          Create Appointment
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { AppointmentAdminDetail, AvailabilitySlot } from "@/types/appointments";
import type { PatientAdmin } from "@/types/patients";
import type { DoctorAdmin } from "@/types/doctors";
import type { AdminServiceSummary } from "@/types/services";

const toast = useToast();
const router = useRouter();
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
const dateInputRef = ref<HTMLInputElement | null>(null);
const bookingModeOptions = [
  { value: "CLINIC_VISIT", label: "Clinic Visit" },
  { value: "VIRTUAL_CONSULTATION", label: "Virtual Consultation" }
];
const minDate = computed(() => formatDateForInput(new Date()));

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
    value: patient.id.toString()
  }))
);

const form = reactive({
  patientId: null as string | null,
  doctorId: null as string | null,
  serviceId: null as string | null,
  bookingMode: "CLINIC_VISIT",
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
    value: service.id.toString()
  }))
);

const refreshKey = ref(0);

const doctorOptions = computed(() => {
  const selectedService = form.serviceId ? Number(form.serviceId) : null;
  return doctors.value
    .filter(doctor =>
      selectedService ? doctor.services.some(service => Number(service.id) === selectedService) : true
    )
    .map(doctor => ({
      label: doctor.fullName,
      value: doctor.id.toString()
    }));
});

if (import.meta.client) {
  watch(
    () => form.serviceId,
    serviceId => {
      if (!serviceId) {
        resetSlots();
        return;
      }
      const doctorMatchesService = doctorOptions.value.some(option => option.value === form.doctorId);
      if (!doctorMatchesService) {
        form.doctorId = null;
      }
    }
  );

  watch(
    [() => form.serviceId, () => form.doctorId, () => form.date, () => form.bookingMode, refreshKey],
    async ([serviceId, doctorId, date, bookingModeValue]) => {
      console.debug("[appointments:new] Watching form changes", { serviceId, doctorId, date, bookingMode: bookingModeValue }); // Debugging log
      await fetchSlots(serviceId ?? null, doctorId ?? null, date ?? "");
    },
    { immediate: true, flush: "post" }
  );
}

watch(
  () => form.date,
  (value) => {
    if (value && value < minDate.value) {
      form.date = minDate.value;
    }
  }
);

function openDatePicker() {
  const input = dateInputRef.value;
  if (!input) return;
  const picker = (input as HTMLInputElement & { showPicker?: () => void }).showPicker;
  if (typeof picker === "function") {
    picker.call(input);
    return;
  }
  input.focus();
  input.click();
}

function formatDateForInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const serviceSlugById = computed(() => {
  const map = new Map<number, string>();
  services.value.forEach(service => map.set(Number(service.id), service.slug));
  return map;
});

const slotFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit"
});

const slotOptions = computed(() => {
  console.debug("[appointments:new] Computing slot options from availabilitySlots", availabilitySlots.value); // Debugging log
  if (!availabilitySlots.value.length) {
    console.warn("[appointments:new] availabilitySlots is empty, no slot options to compute."); // Debugging log
  }
  return availabilitySlots.value.map(slot => {
    const start = new Date(slot.start);
    const end = new Date(slot.end);
    return {
      value: slot.start,
      label: slotFormatter.format(start),
      range: `${slotFormatter.format(start)} – ${slotFormatter.format(end)}`
    };
  });
});

watch(
  availabilitySlots,
  (newSlots) => {
    console.debug("[appointments:new] availabilitySlots updated", newSlots); // Debugging log
  },
  { deep: true }
);

watch(
  slotOptions,
  (newOptions) => {
    console.debug("[appointments:new] slotOptions updated", newOptions); // Debugging log
  },
  { deep: true }
);

const canLoadSlots = computed(() => Boolean(form.serviceId && form.doctorId && form.bookingMode && form.date));

function clearSlots() {
  availabilitySlots.value = [];
  selectedSlot.value = "";
  slotError.value = null;
  slotsLoading.value = false;
}

function resetSlots(clearDate = true) {
  clearSlots();
  if (clearDate) {
    form.date = "";
  }
}

async function fetchSlots(serviceId: string | null, doctorIdValue: string | null, date: string) {
  if (import.meta.server) return;
  if (!serviceId || !doctorIdValue || !date) {
    clearSlots();
    return;
  }

  slotsLoading.value = true;
  slotError.value = null;
  console.debug("[appointments:new] Fetching slots with", { serviceId, doctorIdValue, date }); // Debugging log
  try {
    const serviceSlug = serviceSlugById.value.get(Number(serviceId));
    if (!serviceSlug) {
      throw new Error("Unable to resolve service slug");
    }

    const doctorId = Number(doctorIdValue);
    const response = await request<{
      data: AvailabilitySlot[];
    }>(`/doctors/${doctorId}/availability/slots`, {
      method: "POST",
      body: {
        serviceSlug,
        date
      }
    });

    console.debug("[appointments:new] Raw API response", response); // Log raw API response
    const slots = response?.data && Array.isArray(response.data) ? response.data : Array.isArray(response) ? response : [];
    console.debug("[appointments:new] Parsed slots from API before filtering", slots); // Debugging log

    if (!Array.isArray(slots)) {
      console.error("[appointments:new] API response is not an array", slots); // Debugging log
      throw new Error("Invalid API response format");
    }

    // Validate and transform slots
    const transformedSlots = slots
      .filter(slot => {
        const isValid = typeof slot.start === "string" && typeof slot.end === "string";
        if (!isValid) {
          console.warn("[appointments:new] Slot is missing required fields or has invalid types", slot); // Debugging log
        }
        return isValid;
      })
      .map(slot => ({
        ...slot,
        start: new Date(slot.start).toISOString(),
        end: new Date(slot.end).toISOString()
      }));

    console.debug("[appointments:new] Transformed slots", transformedSlots); // Debugging log

    if (!transformedSlots.length) {
      console.warn("[appointments:new] No valid slots available after transformation."); // Debugging log
    }

    availabilitySlots.value = transformedSlots;
    console.debug("[appointments:new] Updated availabilitySlots", availabilitySlots.value); // Debugging log

    const previousSelection = selectedSlot.value;
    const existing = transformedSlots.find(slot => slot.start === previousSelection);
    selectedSlot.value = existing ? existing.start : transformedSlots.length ? transformedSlots[0].start : "";
  } catch (error: any) {
    console.error("[appointments:new] Error fetching slots", error); // Debugging log
    slotError.value = error?.data?.message ?? error?.message ?? "Unexpected error";
    availabilitySlots.value = [];
  } finally {
    slotsLoading.value = false;
  }
}

function loadSlots() {
  if (import.meta.server) return;
  refreshKey.value += 1;
}

function selectSlot(value: string) {
  selectedSlot.value = value;
}

async function handleSave() {
  if (!form.patientId || !form.doctorId || !form.serviceId || !form.bookingMode || !form.date || !selectedSlot.value) {
    toast.add({
      title: "Missing information",
      description: "Patient, doctor, service, booking mode, date, and slot are required.",
      color: "red"
    });
    return;
  }

  saving.value = true;

  const payload = {
    patientId: Number(form.patientId),
    doctorId: Number(form.doctorId),
    serviceId: Number(form.serviceId),
    scheduledAt: selectedSlot.value,
    bookingMode: form.bookingMode,
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
