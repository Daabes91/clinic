<template>
  <div class="space-y-8">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 p-8 text-white shadow-xl">
      <div class="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-sky-400/20 blur-2xl"></div>

      <div class="relative space-y-6">
        <UBreadcrumb
          :links="[
            { label: 'Patients', to: '/patients' },
            { label: patientName || 'Patient details' }
          ]"
          class="text-sky-100"
        />
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="space-y-2">
            <UBadge color="white" variant="soft" size="md" class="text-sky-700">
              <UIcon name="i-lucide-user-cog" class="h-3.5 w-3.5" />
              Edit patient
            </UBadge>
            <h1 class="text-3xl font-bold lg:text-4xl">
              {{ patientName || "Loading patient…" }}
            </h1>
            <p class="max-w-xl text-sky-100">
              Keep their contact information current so the team can reach out effortlessly.
            </p>
          </div>
          <UButton variant="ghost" color="white" class="hover:bg-white/20" @click="router.push('/patients')">
            Back to patients
          </UButton>
        </div>
      </div>
    </div>

    <UAlert v-if="error" color="red" icon="i-lucide-alert-triangle">
      <template #title>Unable to load patient</template>
      <template #description>
        {{ error.message || "We couldn't find that patient. Return to the directory and try again." }}
      </template>
    </UAlert>

    <UCard v-else class="mx-auto max-w-3xl shadow-card">
      <div v-if="pending" class="space-y-6">
        <USkeleton class="h-12 rounded-3xl" />
        <USkeleton class="h-20 rounded-3xl" />
        <USkeleton class="h-12 rounded-3xl" />
      </div>
      <form v-else class="space-y-8" @submit.prevent="handleSave">
        <div>
          <h2 class="text-lg font-semibold text-slate-900">Primary details</h2>
          <p class="mt-1 text-sm text-slate-500">Update the patient name as it should appear on records.</p>
          <div class="mt-6 grid gap-5 md:grid-cols-2">
            <UFormGroup label="First name" required>
              <UInput v-model="form.firstName" size="lg" />
            </UFormGroup>
            <UFormGroup label="Last name" required>
              <UInput v-model="form.lastName" size="lg" />
            </UFormGroup>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-slate-900">Contact information</h2>
          <p class="mt-1 text-sm text-slate-500">Ensure at least one contact method stays up to date.</p>
          <div class="mt-6 grid gap-5 md:grid-cols-2">
            <UFormGroup label="Email address">
              <UInput v-model="form.email" size="lg" />
            </UFormGroup>
            <UFormGroup label="Phone number">
              <UInput v-model="form.phone" size="lg" />
            </UFormGroup>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <UButton type="button" variant="ghost" color="gray" :disabled="saving" @click="router.push('/patients')">
            Cancel
          </UButton>
          <UButton type="submit" color="violet" :loading="saving">
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
