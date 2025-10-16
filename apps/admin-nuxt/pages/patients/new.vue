<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <header class="space-y-2">
      <UBreadcrumb
        :links="[
          { label: 'Patients', to: '/patients' },
          { label: 'New patient' }
        ]"
      />
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="space-y-1.5">
          <p class="text-sm font-medium text-blue-600">Create patient</p>
          <h1 class="text-3xl font-semibold text-slate-900">Add a new patient</h1>
          <p class="text-sm text-slate-500">
            Store accurate contact details to simplify booking follow-ups and reminders.
          </p>
        </div>
        <UButton variant="ghost" color="gray" @click="router.push('/patients')">
          Cancel
        </UButton>
      </div>
    </header>

    <UCard class="shadow-card">
      <form class="space-y-6" @submit.prevent="handleSave">
        <div class="grid gap-5 md:grid-cols-2">
          <UFormGroup label="First name" required>
            <UInput v-model="form.firstName" placeholder="Layla" size="lg" />
          </UFormGroup>
          <UFormGroup label="Last name" required>
            <UInput v-model="form.lastName" placeholder="Al-Fayed" size="lg" />
          </UFormGroup>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <UFormGroup label="Email address">
            <UInput v-model="form.email" placeholder="layla@example.com" size="lg" />
          </UFormGroup>
          <UFormGroup label="Phone number">
            <UInput v-model="form.phone" placeholder="+971 50 000 0000" size="lg" />
          </UFormGroup>
        </div>

        <div class="flex justify-end gap-3">
          <UButton type="button" variant="ghost" color="gray" :disabled="saving" @click="router.push('/patients')">
            Cancel
          </UButton>
          <UButton type="submit" color="emerald" :loading="saving">
            Create patient
          </UButton>
        </div>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const toast = useToast();
const router = useRouter();
const { request } = useAdminApi();

useHead({
  title: "New Patient – Clinic Admin"
});

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: ""
});

const saving = ref(false);

async function handleSave() {
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

    await request("/patients", {
      method: "POST",
      body: payload
    });

    toast.add({ title: "Patient created" });
    router.push("/patients");
  } catch (error: any) {
    toast.add({
      title: "Unable to create patient",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    saving.value = false;
  }
}
</script>
