<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <header class="space-y-2">
      <UBreadcrumb
        :links="[
          { label: 'Patients', to: '/patients' },
          { label: patientName || 'Patient details' }
        ]"
      />
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="space-y-1.5">
          <p class="text-sm font-medium text-blue-600">Edit patient</p>
          <h1 class="text-3xl font-semibold text-slate-900">
            {{ patientName || 'Loading patient…' }}
          </h1>
          <p class="text-sm text-slate-500">
            Keep their contact information current so the team can reach out effortlessly.
          </p>
        </div>
        <UButton variant="ghost" color="gray" @click="router.push('/patients')">
          Back to patients
        </UButton>
      </div>
    </header>

    <UAlert v-if="error" color="red" icon="i-lucide-alert-triangle">
      <template #title>Unable to load patient</template>
      <template #description>
        {{ error.message || "We couldn't find that patient. Return to the directory and try again." }}
      </template>
    </UAlert>

    <UCard v-else class="shadow-card">
      <div v-if="pending" class="space-y-6">
        <USkeleton class="h-12 rounded-3xl" />
        <USkeleton class="h-20 rounded-3xl" />
        <USkeleton class="h-12 rounded-3xl" />
      </div>
      <form v-else class="space-y-6" @submit.prevent="handleSave">
        <div class="grid gap-5 md:grid-cols-2">
          <UFormGroup label="First name" required>
            <UInput v-model="form.firstName" size="lg" />
          </UFormGroup>
          <UFormGroup label="Last name" required>
            <UInput v-model="form.lastName" size="lg" />
          </UFormGroup>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <UFormGroup label="Email address">
            <UInput v-model="form.email" size="lg" />
          </UFormGroup>
          <UFormGroup label="Phone number">
            <UInput v-model="form.phone" size="lg" />
          </UFormGroup>
        </div>

        <div class="flex justify-end gap-3">
          <UButton type="button" variant="ghost" color="gray" :disabled="saving" @click="router.push('/patients')">
            Cancel
          </UButton>
          <UButton type="submit" color="emerald" :loading="saving">
            Save changes
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { PatientAdmin } from "@/types/patients";

const toast = useToast();
const router = useRouter();
const route = useRoute();
const { request } = useAdminApi();

useHead({
  title: "Edit Patient – Clinic Admin"
});

const patientId = computed(() => Number(route.params.id));
if (Number.isNaN(patientId.value)) {
  throw createError({ statusCode: 404, statusMessage: "Patient not found" });
}

const { data, pending, error } = await useAsyncData(`admin-patient-${patientId.value}`, async () => {
  return await request<PatientAdmin>(`/patients/${patientId.value}`);
});

const patient = computed(() => data.value ?? null);
const patientName = computed(() =>
  patient.value ? `${patient.value.firstName} ${patient.value.lastName}` : ""
);

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: ""
});

watchEffect(() => {
  if (!patient.value) return;
  form.firstName = patient.value.firstName ?? "";
  form.lastName = patient.value.lastName ?? "";
  form.email = patient.value.email ?? "";
  form.phone = patient.value.phone ?? "";
});

const saving = ref(false);

async function handleSave() {
  if (!patient.value) return;
  saving.value = true;

  const payload = {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim() || null,
    phone: form.phone.trim() || null
  };

  try {
    if (!payload.firstName || !payload.lastName) {
      throw new Error("First and last name are required");
    }

    await request(`/patients/${patient.value.id}`, {
      method: "PUT",
      body: payload
    });

    toast.add({ title: "Patient updated" });
    router.push("/patients");
  } catch (error: any) {
    toast.add({
      title: "Unable to update patient",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    saving.value = false;
  }
}
</script>
