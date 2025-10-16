<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <header class="space-y-2">
      <UBreadcrumb
        :links="[
          { label: 'Doctors', to: '/doctors' },
          { label: doctor?.fullName ?? 'Doctor details' }
        ]"
      />
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="space-y-1.5">
          <p class="text-sm font-medium text-emerald-600">Edit doctor</p>
          <h1 class="text-3xl font-semibold text-slate-900">
            {{ doctor?.fullName || 'Loading doctor…' }}
          </h1>
          <p class="text-sm text-slate-500">
            Keep the profile accurate so patients see the right expertise, languages, and services.
          </p>
        </div>
        <UButton variant="ghost" color="gray" @click="router.push('/doctors')">
          Back to doctors
        </UButton>
      </div>
    </header>

    <UAlert v-if="error" color="red" icon="i-lucide-alert-triangle">
      <template #title>Unable to load doctor</template>
      <template #description>
        {{ error.message || "We couldn't find that doctor. Return to the directory and try again." }}
      </template>
    </UAlert>

    <div v-else class="space-y-6">
      <UCard class="shadow-card">
        <div v-if="pending" class="space-y-6">
          <USkeleton class="h-12 rounded-3xl" />
          <USkeleton class="h-32 rounded-3xl" />
          <USkeleton class="h-12 rounded-3xl" />
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
            <UFormGroup label="Languages" hint="Enter comma-separated language codes (e.g. en, ar)">
              <UInput v-model="form.localesInput" placeholder="en, ar" size="lg" />
            </UFormGroup>

            <UFormGroup label="Services">
              <USelectMenu
                v-model="form.serviceIds"
                :options="serviceOptions"
                option-attribute="label"
                value-attribute="value"
                placeholder="Assign services"
                multiple
                searchable
              />
            </UFormGroup>
          </div>

          <div class="flex justify-end gap-3">
            <UButton type="button" variant="ghost" color="gray" :disabled="saving" @click="router.push('/doctors')">
              Cancel
            </UButton>
            <UButton type="submit" color="emerald" :loading="saving">
              Save changes
            </UButton>
          </div>
        </form>
      </UCard>

      <UCard class="shadow-card">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-widest text-slate-400">Schedule</p>
              <h2 class="text-lg font-semibold text-slate-900">Doctor availability</h2>
              <p class="text-sm text-slate-500">
                Define recurring or single-day availability windows. Patients can only book inside these slots.
              </p>
            </div>
            <div class="flex gap-2">
              <UButton variant="ghost" color="gray" @click="resetAvailabilityForm">
                New window
              </UButton>
            </div>
          </div>
        </template>

        <div class="grid gap-6 lg:grid-cols-2">
          <form class="space-y-5" @submit.prevent="handleAvailabilitySave">
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormGroup label="Type" required>
                <USelectMenu
                  v-model="availabilityForm.type"
                  :options="availabilityTypeOptions"
                  value-attribute="value"
                  option-attribute="label"
                />
              </UFormGroup>
              <UFormGroup v-if="isWeekly" label="Day of week" required>
                <USelectMenu
                  v-model="availabilityForm.dayOfWeek"
                  :options="dayOfWeekOptions"
                  value-attribute="value"
                  option-attribute="label"
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
              <UButton type="submit" color="emerald" :loading="availabilitySaving">
                {{ availabilityForm.id ? 'Update availability' : 'Add availability' }}
              </UButton>
            </div>
          </form>

          <div class="space-y-4">
            <UAlert v-if="availabilityError" color="red" icon="i-lucide-alert-triangle">
              <template #title>Unable to load availability</template>
              <template #description>{{ availabilityError?.message }}</template>
            </UAlert>

            <UTable
              :rows="availabilityRows"
              :columns="availabilityColumns"
              :loading="availabilityPending"
              class="rounded-2xl"
              :empty-state="{ icon: 'i-lucide-calendar-x', label: 'No availability configured yet.' }"
            >
              <template #type-data="{ row }">
                <UBadge color="violet" variant="soft">{{ row.typeLabel }}</UBadge>
              </template>
              <template #when-data="{ row }">
                <div class="text-sm text-slate-700">{{ row.when }}</div>
              </template>
              <template #time-data="{ row }">
                <div class="text-sm text-slate-500">{{ row.time }}</div>
              </template>
              <template #actions-data="{ row }">
                <div class="flex justify-end gap-2">
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
              </template>
            </UTable>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminServiceSummary } from "@/types/services";
import type { DoctorAdmin, DoctorAvailability } from "@/types/doctors";

const toast = useToast();
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
    value: service.id
  }))
);

const { data, pending, error, refresh: refreshDoctor } = await useAsyncData(`admin-doctor-${doctorId.value}`, async () => {
  return await request<DoctorAdmin>(`/doctors/${doctorId.value}`);
});

const doctor = computed(() => data.value ?? null);

const form = reactive({
  fullName: "",
  specialty: "",
  bio: "",
  localesInput: "",
  serviceIds: [] as number[]
});

watchEffect(() => {
  if (!doctor.value) return;
  form.fullName = doctor.value.fullName ?? "";
  form.specialty = doctor.value.specialty ?? "";
  form.bio = doctor.value.bio ?? "";
  form.localesInput = (doctor.value.locales ?? []).join(", ");
  form.serviceIds = doctor.value.services.map(service => service.id);
});

const saving = ref(false);

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

const availabilityColumns = [
  { key: "type", label: "Type" },
  { key: "when", label: "When", class: "min-w-[120px]" },
  { key: "time", label: "Time", class: "min-w-[120px]" },
  { key: "actions", label: "", class: "w-20 text-right" }
];

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
    locales: parseLocales(form.localesInput),
    serviceIds: form.serviceIds
  };

  try {
    if (!payload.fullName) {
      throw new Error("Doctor name is required");
    }

    await request(`/doctors/${doctor.value.id}`, {
      method: "PUT",
      body: payload
    });

    toast.add({ title: "Doctor updated" });
    await Promise.all([refreshDoctor(), refreshAvailability()]);
    router.push("/doctors");
  } catch (error: any) {
    toast.add({
      title: "Unable to update doctor",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
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

    toast.add({ title: availabilityForm.id ? "Availability updated" : "Availability added" });
    resetAvailabilityForm();
    await refreshAvailability();
  } catch (error: any) {
    toast.add({
      title: "Unable to save availability",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
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
    toast.add({ title: "Availability deleted" });
    await refreshAvailability();
  } catch (error: any) {
    toast.add({
      title: "Unable to delete availability",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    availabilityDeletingId.value = null;
  }
}

resetAvailabilityForm();
</script>
