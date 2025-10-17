<template>
  <div class="space-y-6">
    <!-- Hero Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-8 text-white shadow-xl">
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-emerald-500/20 blur-2xl"></div>

      <div class="relative space-y-4">
        <UBreadcrumb
          :links="[
            { label: 'Doctors', to: '/doctors' },
            { label: doctor?.fullName ?? 'Doctor details' }
          ]"
          :ui="{ base: 'text-white/80 hover:text-white' }"
        />

        <div class="flex flex-wrap items-start justify-between gap-6">
          <div class="flex items-start gap-4">
            <UAvatar
              v-if="doctor"
              :alt="doctor.fullName"
              size="xl"
              class="ring-4 ring-white/30"
            />
            <div class="space-y-2">
              <UBadge color="white" variant="soft" size="md" class="text-emerald-700">
                <UIcon name="i-lucide-stethoscope" class="h-3.5 w-3.5" />
                Doctor Profile
              </UBadge>
              <h1 class="text-3xl font-bold lg:text-4xl">
                {{ doctor?.fullName || 'Loading doctor…' }}
              </h1>
              <p v-if="doctor?.specialty" class="text-lg text-emerald-100">
                {{ doctor.specialty }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <UButton
              variant="ghost"
              color="white"
              icon="i-lucide-arrow-left"
              @click="router.push('/doctors')"
            >
              Back
            </UButton>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid gap-4 sm:grid-cols-3" v-if="doctor">
          <div class="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-layers" class="h-5 w-5" />
              <div>
                <p class="text-sm text-emerald-200">Services</p>
                <p class="text-2xl font-bold">{{ doctor.services?.length || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-globe" class="h-5 w-5" />
              <div>
                <p class="text-sm text-emerald-200">Languages</p>
                <p class="text-2xl font-bold">{{ doctor.locales?.length || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-calendar-days" class="h-5 w-5" />
              <div>
                <p class="text-sm text-emerald-200">Availability</p>
                <p class="text-2xl font-bold">{{ availabilities.length }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UAlert v-if="error" color="red" icon="i-lucide-alert-triangle">
      <template #title>Unable to load doctor</template>
      <template #description>
        {{ error.message || "We couldn't find that doctor. Return to the directory and try again." }}
      </template>
    </UAlert>

    <div v-else class="grid gap-6 lg:grid-cols-3">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Profile Information -->
        <UCard class="shadow-card">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <UIcon name="i-lucide-user" class="h-5 w-5" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Profile Information</h2>
                <p class="text-sm text-slate-500">Update doctor's basic details</p>
              </div>
            </div>
          </template>

          <div v-if="pending" class="space-y-6">
            <USkeleton class="h-12 rounded-lg" />
            <USkeleton class="h-32 rounded-lg" />
            <USkeleton class="h-12 rounded-lg" />
          </div>

          <form v-else class="space-y-6" @submit.prevent="handleSave">
            <div class="grid gap-5 md:grid-cols-2">
              <UFormGroup label="Full name" required>
                <UInput v-model="form.fullName" placeholder="Dr. Sarah Hassan" size="lg" />
              </UFormGroup>
              <UFormGroup label="Specialty">
                <UInput v-model="form.specialty" placeholder="Cosmetic Dentistry" size="lg" />
              </UFormGroup>
            </div>

            <UFormGroup label="Biography">
              <UTextarea
                v-model="form.bio"
                :rows="5"
                size="lg"
                placeholder="Brief introduction that highlights experience and approach to care."
              />
            </UFormGroup>

            <div class="grid gap-5 md:grid-cols-2">
              <UFormGroup label="Languages">
                <div class="space-y-3 rounded-lg border border-slate-300 bg-white p-4">
                  <!-- Select All Checkbox -->
                  <div class="flex items-center gap-3 pb-3 border-b border-slate-200">
                    <input
                      id="select-all-languages-edit"
                      type="checkbox"
                      :checked="allLanguagesSelected"
                      :indeterminate="someLanguagesSelected"
                      class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                      @change="toggleAllLanguages"
                    />
                    <label
                      for="select-all-languages-edit"
                      class="text-sm font-semibold text-slate-900 cursor-pointer select-none"
                    >
                      Select All
                    </label>
                    <span class="ml-auto text-xs text-slate-500">
                      {{ form.locales.length }} / {{ languageOptions.length }} selected
                    </span>
                  </div>

                  <!-- Individual Language Checkboxes -->
                  <div class="space-y-2.5">
                    <div
                      v-for="option in languageOptions"
                      :key="option.value"
                      class="flex items-center gap-3 p-2 rounded-md hover:bg-emerald-50/50 transition-colors"
                    >
                      <input
                        :id="`language-edit-${option.value}`"
                        type="checkbox"
                        :value="option.value"
                        v-model="form.locales"
                        class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <label
                        :for="`language-edit-${option.value}`"
                        class="flex-1 text-sm text-slate-700 cursor-pointer select-none"
                      >
                        {{ option.label }}
                      </label>
                    </div>
                  </div>
                </div>
              </UFormGroup>

              <UFormGroup label="Services">
                <div class="space-y-3 rounded-lg border border-slate-300 bg-white p-4">
                  <!-- Select All Checkbox -->
                  <div class="flex items-center gap-3 pb-3 border-b border-slate-200">
                    <input
                      id="select-all-services"
                      type="checkbox"
                      :checked="allServicesSelected"
                      :indeterminate="someServicesSelected"
                      class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                      @change="toggleAllServices"
                    />
                    <label
                      for="select-all-services"
                      class="text-sm font-semibold text-slate-900 cursor-pointer select-none"
                    >
                      Select All
                    </label>
                    <span class="ml-auto text-xs text-slate-500">
                      {{ form.serviceIds.length }} / {{ serviceOptions.length }} selected
                    </span>
                  </div>

                  <!-- Individual Service Checkboxes -->
                  <div class="space-y-2.5 max-h-64 overflow-y-auto">
                    <div
                      v-for="option in serviceOptions"
                      :key="option.value"
                      class="flex items-center gap-3 p-2 rounded-md hover:bg-emerald-50/50 transition-colors"
                    >
                      <input
                        :id="`service-${option.value}`"
                        type="checkbox"
                        :value="option.value"
                        v-model="form.serviceIds"
                        class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <label
                        :for="`service-${option.value}`"
                        class="flex-1 text-sm text-slate-700 cursor-pointer select-none"
                      >
                        {{ option.label }}
                      </label>
                    </div>
                  </div>

                  <!-- Empty State -->
                  <div v-if="serviceOptions.length === 0" class="py-8 text-center text-sm text-slate-500">
                    No services available
                  </div>
                </div>
              </UFormGroup>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <UButton type="button" variant="ghost" color="gray" :disabled="saving" @click="router.push('/doctors')">
                Cancel
              </UButton>
              <UButton type="submit" color="emerald" :loading="saving" icon="i-lucide-save">
                Save changes
              </UButton>
            </div>
          </form>
        </UCard>

        <!-- Availability Schedule -->
        <UCard class="shadow-card">
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <UIcon name="i-lucide-calendar-clock" class="h-5 w-5" />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-slate-900">Availability Schedule</h2>
                  <p class="text-sm text-slate-500">
                    Define recurring or single-day availability windows
                  </p>
                </div>
              </div>
              <UButton color="emerald" variant="soft" icon="i-lucide-plus" size="sm" @click="resetAvailabilityForm">
                Add Slot
              </UButton>
            </div>
          </template>

          <UAlert v-if="availabilityError" color="red" icon="i-lucide-alert-triangle" class="mb-4">
            <template #title>Unable to load availability</template>
            <template #description>{{ availabilityError?.message }}</template>
          </UAlert>

          <div class="space-y-6">
            <!-- Availability Form -->
            <form class="rounded-lg border border-slate-200 bg-slate-50 p-5 space-y-5" @submit.prevent="handleAvailabilitySave">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-slate-900">
                  {{ availabilityForm.id ? 'Edit Availability' : 'New Availability Slot' }}
                </h3>
                <UBadge v-if="availabilityForm.id" color="blue" variant="soft">Editing</UBadge>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <UFormGroup label="Type" required>
                  <USelect
                    v-model="availabilityForm.type"
                    :options="availabilityTypeOptions"
                    value-attribute="value"
                    option-attribute="label"
                    size="lg"
                  />
                </UFormGroup>

                <UFormGroup v-if="isWeekly" label="Day of week" required>
                  <USelect
                    v-model="availabilityForm.dayOfWeek"
                    :options="dayOfWeekOptions"
                    value-attribute="value"
                    option-attribute="label"
                    size="lg"
                  />
                </UFormGroup>

                <UFormGroup v-else label="Specific date" required>
                  <UInput v-model="availabilityForm.date" type="date" size="lg" />
                </UFormGroup>

                <UFormGroup label="Start time" required>
                  <UInput v-model="availabilityForm.startTime" type="time" size="lg" step="1800" />
                </UFormGroup>

                <UFormGroup label="End time" required>
                  <UInput v-model="availabilityForm.endTime" type="time" size="lg" step="1800" />
                </UFormGroup>
              </div>

              <div class="flex justify-end gap-3">
                <UButton type="button" variant="ghost" color="gray" :disabled="availabilitySaving" @click="resetAvailabilityForm">
                  Cancel
                </UButton>
                <UButton type="submit" color="emerald" :loading="availabilitySaving" icon="i-lucide-check">
                  {{ availabilityForm.id ? 'Update' : 'Add Slot' }}
                </UButton>
              </div>
            </form>

            <!-- Availability List -->
            <div class="space-y-3">
              <h3 class="font-semibold text-slate-900">Current Availability</h3>

              <div v-if="availabilityPending" class="space-y-2">
                <USkeleton v-for="i in 3" :key="i" class="h-16 rounded-lg" />
              </div>

              <div v-else-if="!availabilityRows.length" class="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                <UIcon name="i-lucide-calendar-x" class="mx-auto h-12 w-12 text-slate-400 mb-3" />
                <p class="text-sm font-medium text-slate-600">No availability configured yet</p>
                <p class="text-xs text-slate-500 mt-1">Add time slots to allow patient bookings</p>
              </div>

              <div v-else class="space-y-2">
                <div
                  v-for="row in availabilityRows"
                  :key="row.id"
                  class="group flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-sm"
                >
                  <div class="flex items-center gap-4">
                    <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                      <UIcon name="i-lucide-clock" class="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <p class="font-medium text-slate-900">{{ row.when }}</p>
                        <UBadge color="emerald" variant="soft" size="sm">{{ row.typeLabel }}</UBadge>
                      </div>
                      <p class="text-sm text-slate-500">{{ row.time }}</p>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <UButton
                      icon="i-lucide-pencil"
                      variant="ghost"
                      color="gray"
                      size="xs"
                      class="hover:bg-emerald-50"
                      aria-label="Edit availability"
                      @click="editAvailability(row)"
                    />
                    <UButton
                      icon="i-lucide-trash-2"
                      variant="ghost"
                      color="red"
                      size="xs"
                      class="hover:bg-red-50"
                      :loading="availabilityDeletingId === row.id"
                      :disabled="availabilityDeletingId === row.id"
                      aria-label="Delete availability"
                      @click="removeAvailability(row.id)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Services Card -->
        <UCard class="shadow-card">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                <UIcon name="i-lucide-layers" class="h-5 w-5" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Services</h2>
                <p class="text-sm text-slate-500">{{ doctor?.services?.length || 0 }} service(s)</p>
              </div>
            </div>
          </template>

          <div v-if="doctor?.services?.length" class="space-y-2">
            <div
              v-for="service in doctor.services"
              :key="service.id"
              class="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
            >
              <UIcon name="i-lucide-check-circle" class="h-4 w-4 text-emerald-600" />
              <span class="text-sm font-medium text-slate-900">{{ service.nameEn || service.slug }}</span>
            </div>
          </div>
          <div v-else class="py-8 text-center">
            <UIcon name="i-lucide-layers" class="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p class="text-sm text-slate-500">No services assigned</p>
          </div>
        </UCard>

        <!-- Languages Card -->
        <UCard class="shadow-card">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <UIcon name="i-lucide-globe" class="h-5 w-5" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Languages</h2>
                <p class="text-sm text-slate-500">{{ doctor?.locales?.length || 0 }} language(s)</p>
              </div>
            </div>
          </template>

          <div v-if="doctor?.locales?.length" class="flex flex-wrap gap-2">
            <UBadge
              v-for="locale in doctor.locales"
              :key="locale"
              color="blue"
              variant="soft"
              size="lg"
              class="uppercase"
            >
              {{ locale }}
            </UBadge>
          </div>
          <div v-else class="py-8 text-center">
            <UIcon name="i-lucide-globe" class="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p class="text-sm text-slate-500">No languages specified</p>
          </div>
        </UCard>

        <!-- Quick Actions -->
        <UCard class="shadow-card">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <UIcon name="i-lucide-zap" class="h-5 w-5" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Quick Actions</h2>
              </div>
            </div>
          </template>

          <div class="space-y-2">
            <UButton
              block
              variant="soft"
              color="violet"
              icon="i-lucide-calendar"
              @click="router.push(`/appointments?doctorId=${doctorId}`)"
            >
              View Appointments
            </UButton>
            <UButton
              block
              variant="soft"
              color="blue"
              icon="i-lucide-users"
              @click="viewDoctorPatients"
            >
              View Patients
            </UButton>
            <UButton
              block
              variant="soft"
              color="amber"
              icon="i-lucide-bar-chart"
              disabled
            >
              View Statistics
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminServiceSummary } from "@/types/services";
import type { DoctorAdmin, DoctorAvailability } from "@/types/doctors";

const toast = useEnhancedToast();
const router = useRouter();
const route = useRoute();
const { fetcher, request } = useAdminApi();

useHead({
  title: "Edit Doctor – Clinic Admin"
});

const doctorId = computed(() => Number(route.params.id));
if (Number.isNaN(doctorId.value)) {
  throw createError({ statusCode: 404, statusMessage: "Doctor not found" });
}

const { data: servicesData } = await useAsyncData("admin-doctor-services", () =>
  fetcher<AdminServiceSummary[]>("/services", [])
);

const serviceOptions = computed(() =>
  (servicesData.value ?? []).map(service => ({
    label: service.nameEn ?? service.nameAr ?? service.slug,
    value: service.id.toString()
  }))
);

// Language options
const languageOptions = [
  { label: "English", value: "en" },
  { label: "Arabic", value: "ar" },
  { label: "Russian", value: "ru" }
];

const { data, pending, error, refresh: refreshDoctor } = await useAsyncData(`admin-doctor-${doctorId.value}`, async () => {
  return await request<DoctorAdmin>(`/doctors/${doctorId.value}`);
});

const doctor = computed(() => data.value ?? null);

const form = reactive({
  fullName: "",
  specialty: "",
  bio: "",
  locales: [] as string[],
  serviceIds: [] as string[]
});

watchEffect(() => {
  if (!doctor.value) return;
  form.fullName = doctor.value.fullName ?? "";
  form.specialty = doctor.value.specialty ?? "";
  form.bio = doctor.value.bio ?? "";
  form.locales = doctor.value.locales ?? [];
  form.serviceIds = doctor.value.services.map(service => service.id.toString());
});

const saving = ref(false);

// Computed properties for "Select All" functionality - Languages
const allLanguagesSelected = computed(() => {
  return languageOptions.length > 0 && form.locales.length === languageOptions.length;
});

const someLanguagesSelected = computed(() => {
  return form.locales.length > 0 && form.locales.length < languageOptions.length;
});

// Toggle all languages
function toggleAllLanguages(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    form.locales = languageOptions.map(option => option.value);
  } else {
    form.locales = [];
  }
}

// Computed properties for "Select All" functionality - Services
const allServicesSelected = computed(() => {
  return serviceOptions.value.length > 0 && form.serviceIds.length === serviceOptions.value.length;
});

const someServicesSelected = computed(() => {
  return form.serviceIds.length > 0 && form.serviceIds.length < serviceOptions.value.length;
});

// Toggle all services
function toggleAllServices(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    form.serviceIds = serviceOptions.value.map(option => option.value);
  } else {
    form.serviceIds = [];
  }
}

const {
  data: availabilityData,
  pending: availabilityPending,
  error: availabilityError,
  refresh: refreshAvailability
} = await useAsyncData(`admin-doctor-${doctorId.value}-availability`, async () => {
  return await request<DoctorAvailability[]>(`/doctors/${doctorId.value}/availability`);
});

const availabilities = computed(() => availabilityData.value ?? []);

const availabilityForm = reactive({
  id: null as number | null,
  type: "WEEKLY" as "WEEKLY" | "ONE_TIME" | string,
  dayOfWeek: "MONDAY",
  date: "",
  startTime: "09:00",
  endTime: "17:00"
});

const availabilityTypeOptions = [
  { label: "Weekly recurring", value: "WEEKLY" },
  { label: "Single day", value: "ONE_TIME" }
];

const dayOfWeekOptions = [
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
  { label: "Sunday", value: "SUNDAY" }
];

const availabilitySaving = ref(false);
const availabilityDeletingId = ref<number | null>(null);

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

const availabilityRows = computed(() =>
  availabilities.value.map(item => {
    const typeLabel = item.type === "WEEKLY" ? "Weekly" : "Single day";
    const when = item.type === "WEEKLY"
      ? formatDayOfWeek(item.dayOfWeek)
      : item.date
        ? dateFormatter.format(new Date(`${item.date}T00:00:00Z`))
        : "";
    const time = `${item.startTime} – ${item.endTime}`;

    return {
      ...item,
      typeLabel,
      when,
      time
    };
  })
);

const isWeekly = computed(() => availabilityForm.type === "WEEKLY");

function parseLocales(input: string): string[] {
  if (!input) {
    return [];
  }
  return input
    .split(",")
    .map(value => value.trim().toLowerCase())
    .filter(value => value.length > 0);
}

async function handleSave() {
  if (!doctor.value) return;
  saving.value = true;

  const payload = {
    fullName: form.fullName.trim(),
    specialty: form.specialty.trim() || null,
    bio: form.bio.trim() || null,
    locales: form.locales,
    serviceIds: form.serviceIds.map(id => Number(id))
  };

  try {
    if (!payload.fullName) {
      throw new Error("Doctor name is required");
    }

    await request(`/doctors/${doctor.value.id}`, {
      method: "PUT",
      body: payload
    });

    toast.updated("Doctor");
    await Promise.all([refreshDoctor(), refreshAvailability()]);
    router.push("/doctors");
  } catch (error: any) {
    toast.error({
      title: "Unable to update doctor",
      error
    });
  } finally {
    saving.value = false;
  }
}

function formatDayOfWeek(value: string | null): string {
  if (!value) return "";
  const lower = value.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function resetAvailabilityForm() {
  availabilityForm.id = null;
  availabilityForm.type = "WEEKLY";
  availabilityForm.dayOfWeek = "MONDAY";
  availabilityForm.date = "";
  availabilityForm.startTime = "09:00";
  availabilityForm.endTime = "17:00";
}

function editAvailability(row: DoctorAvailability & { typeLabel: string }) {
  availabilityForm.id = row.id;
  availabilityForm.type = (row.type === "WEEKLY" ? "WEEKLY" : "ONE_TIME");
  availabilityForm.dayOfWeek = row.dayOfWeek ?? "MONDAY";
  availabilityForm.date = row.date ?? "";
  availabilityForm.startTime = row.startTime;
  availabilityForm.endTime = row.endTime;
}

async function handleAvailabilitySave() {
  if (!doctor.value) return;
  availabilitySaving.value = true;

  try {
    if (isWeekly.value && !availabilityForm.dayOfWeek) {
      throw new Error("Select a day of week");
    }
    if (!isWeekly.value && !availabilityForm.date) {
      throw new Error("Select a date");
    }

    const payload = {
      type: availabilityForm.type,
      dayOfWeek: isWeekly.value ? availabilityForm.dayOfWeek : null,
      date: !isWeekly.value ? availabilityForm.date : null,
      startTime: availabilityForm.startTime,
      endTime: availabilityForm.endTime
    };

    const path = `/doctors/${doctorId.value}/availability` + (availabilityForm.id ? `/${availabilityForm.id}` : "");
    const method = availabilityForm.id ? "PUT" : "POST";

    await request<DoctorAvailability>(path, {
      method,
      body: payload
    });

    if (availabilityForm.id) {
      toast.success({ title: "Availability updated", description: "The time slot has been updated." });
    } else {
      toast.success({ title: "Availability added", description: "New time slot is now available for bookings." });
    }
    resetAvailabilityForm();
    await refreshAvailability();
  } catch (error: any) {
    toast.error({
      title: "Unable to save availability",
      error
    });
  } finally {
    availabilitySaving.value = false;
  }
}

async function removeAvailability(id: number) {
  if (!doctor.value) return;
  availabilityDeletingId.value = id;
  try {
    await request(`/doctors/${doctorId.value}/availability/${id}`, {
      method: "DELETE"
    });
    toast.deleted("Availability slot");
    await refreshAvailability();
  } catch (error: any) {
    toast.error({
      title: "Unable to delete availability",
      error
    });
  } finally {
    availabilityDeletingId.value = null;
  }
}

function viewDoctorPatients() {
  // Navigate to patients page (when implemented, can add doctor filter)
  toast.comingSoon("Patient filtering by doctor");
  // Future: router.push(`/patients?doctorId=${doctorId.value}`);
}

resetAvailabilityForm();
</script>
