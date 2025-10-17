<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <header class="space-y-2">
      <UBreadcrumb
        :links="[
          { label: 'Doctors', to: '/doctors' },
          { label: 'New doctor' }
        ]"
      />
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="space-y-1.5">
          <p class="text-sm font-medium text-emerald-600">Create doctor</p>
          <h1 class="text-3xl font-semibold text-slate-900">Add a new provider</h1>
          <p class="text-sm text-slate-500">
            Capture their specialty, languages, and associated services to keep the directory current.
          </p>
        </div>
        <UButton variant="ghost" color="gray" @click="router.push('/doctors')">
          Cancel
        </UButton>
      </div>
    </header>

    <UCard class="shadow-card">
      <form class="space-y-6" @submit.prevent="handleSave">
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
                  id="select-all-languages"
                  type="checkbox"
                  :checked="allLanguagesSelected"
                  :indeterminate="someLanguagesSelected"
                  class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer"
                  @change="toggleAllLanguages"
                />
                <label
                  for="select-all-languages"
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
                  class="flex items-center gap-3 p-2 rounded-md hover:bg-violet-50/50 transition-colors"
                >
                  <input
                    :id="`language-${option.value}`"
                    type="checkbox"
                    :value="option.value"
                    v-model="form.locales"
                    class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <label
                    :for="`language-${option.value}`"
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
                  class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer"
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
                  class="flex items-center gap-3 p-2 rounded-md hover:bg-violet-50/50 transition-colors"
                >
                  <input
                    :id="`service-${option.value}`"
                    type="checkbox"
                    :value="option.value"
                    v-model="form.serviceIds"
                    class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer"
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

        <div class="flex justify-end gap-3">
          <UButton type="button" variant="ghost" color="gray" :disabled="saving" @click="router.push('/doctors')">
            Cancel
          </UButton>
          <UButton type="submit" color="emerald" :loading="saving">
            Create doctor
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { AdminServiceSummary } from "@/types/services";

const toast = useEnhancedToast();
const router = useRouter();
const { fetcher, request } = useAdminApi();

useHead({
  title: "New Doctor – Clinic Admin"
});

const { data: servicesData } = await useAsyncData("admin-doctor-services", () =>
  fetcher<AdminServiceSummary[]>("/services", [])
);

const services = computed(() => servicesData.value ?? []);
const serviceOptions = computed(() =>
  services.value.map(service => ({
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

const form = reactive({
  fullName: "",
  specialty: "",
  bio: "",
  locales: [] as string[],
  serviceIds: [] as string[]
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

    await request("/doctors", {
      method: "POST",
      body: payload
    });

    toast.created("Doctor");
    router.push("/doctors");
  } catch (error: any) {
    toast.error({
      title: "Unable to create doctor",
      error
    });
  } finally {
    saving.value = false;
  }
}
</script>
