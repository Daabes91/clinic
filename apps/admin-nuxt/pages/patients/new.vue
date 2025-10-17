<template>
  <div class="space-y-8">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 p-8 text-white shadow-xl">
      <div class="absolute inset-y-0 right-0 w-1/2 rounded-full bg-white/10 blur-3xl"></div>
      <div class="relative space-y-6">
        <UBreadcrumb
          :links="[
            { label: 'Patients', to: '/patients' },
            { label: 'New patient' }
          ]"
          class="text-sky-100"
        />
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="space-y-2">
            <UBadge color="white" variant="soft" size="md" class="text-sky-700">
              <UIcon name="i-lucide-user-round-plus" class="h-3.5 w-3.5" />
              Create Patient
            </UBadge>
            <h1 class="text-3xl font-bold lg:text-4xl">Add a new patient</h1>
            <p class="max-w-xl text-sky-100">
              Capture accurate contact details so the care team can reach patients quickly for confirmations and follow-ups.
            </p>
          </div>
          <UButton variant="ghost" color="white" class="hover:bg-white/20" @click="router.push('/patients')">
            Cancel
          </UButton>
        </div>
      </div>
    </div>

    <UCard class="mx-auto max-w-3xl shadow-card">
      <form class="space-y-8" @submit.prevent="handleSave">
        <div>
          <h2 class="text-lg font-semibold text-slate-900">Primary details</h2>
          <p class="mt-1 text-sm text-slate-500">These fields help staff greet and verify the patient correctly.</p>
          <div class="mt-6 grid gap-5 md:grid-cols-2">
            <UFormGroup label="First name" required>
              <UInput v-model="form.firstName" placeholder="Layla" size="lg" />
            </UFormGroup>
            <UFormGroup label="Last name" required>
              <UInput v-model="form.lastName" placeholder="Al-Fayed" size="lg" />
            </UFormGroup>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-slate-900">Contact information</h2>
          <p class="mt-1 text-sm text-slate-500">Reachable details keep reminders and confirmations on track.</p>
          <div class="mt-6 grid gap-5 md:grid-cols-2">
            <UFormGroup label="Email address">
              <UInput v-model="form.email" placeholder="layla@example.com" size="lg" />
            </UFormGroup>
            <UFormGroup label="Phone number">
              <UInput v-model="form.phone" placeholder="+971 50 000 0000" size="lg" />
            </UFormGroup>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <UButton type="button" variant="ghost" color="gray" :disabled="saving" @click="router.push('/patients')">
            Cancel
          </UButton>
          <UButton type="submit" color="violet" :loading="saving">
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
