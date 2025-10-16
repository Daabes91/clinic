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
            Create doctor
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { AdminServiceSummary } from "@/types/services";

const toast = useToast();
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
    value: service.id
  }))
);

const form = reactive({
  fullName: "",
  specialty: "",
  bio: "",
  localesInput: "",
  serviceIds: [] as number[]
});

const saving = ref(false);

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
    locales: parseLocales(form.localesInput),
    serviceIds: form.serviceIds
  };

  try {
    if (!payload.fullName) {
      throw new Error("Doctor name is required");
    }

    await request("/doctors", {
      method: "POST",
      body: payload
    });

    toast.add({ title: "Doctor created" });
    router.push("/doctors");
  } catch (error: any) {
    toast.add({
      title: "Unable to create doctor",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    saving.value = false;
  }
}
</script>
