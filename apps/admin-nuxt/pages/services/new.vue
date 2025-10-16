<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <header class="space-y-2">
      <UBreadcrumb
        :links="[
          { label: 'Services', to: '/services' },
          { label: 'New service' }
        ]"
      />
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="space-y-1.5">
          <p class="text-sm font-medium text-emerald-600">Create service</p>
          <h1 class="text-3xl font-semibold text-slate-900">Add a new clinic service</h1>
          <p class="text-sm text-slate-500">
            Provide localized names and descriptions that will surface in the booking experience.
          </p>
        </div>
        <UButton variant="ghost" color="gray" @click="router.push('/services')">
          Cancel
        </UButton>
      </div>
    </header>

    <UCard class="shadow-card">
      <form class="space-y-6" @submit.prevent="handleSave">
        <div class="grid gap-5 md:grid-cols-2">
          <UFormGroup label="Name (English)" required>
            <UInput v-model="form.nameEn" placeholder="Teeth whitening" size="lg" />
          </UFormGroup>
          <UFormGroup label="Name (Arabic)">
            <UInput v-model="form.nameAr" placeholder="" dir="auto" size="lg" />
          </UFormGroup>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <UFormGroup label="Summary (English)">
            <UTextarea
              v-model="form.summaryEn"
              :rows="4"
              size="lg"
              placeholder="Short description shown on the website"
            />
          </UFormGroup>
          <UFormGroup label="Summary (Arabic)">
            <UTextarea v-model="form.summaryAr" :rows="4" size="lg" placeholder="" dir="auto" />
          </UFormGroup>
        </div>

        <UFormGroup label="Slug" hint="Used in the public URL" required>
          <UInput v-model="form.slug" placeholder="teeth-whitening" size="lg" />
        </UFormGroup>

        <div class="flex justify-end gap-3">
          <UButton type="button" variant="ghost" color="gray" :disabled="saving" @click="router.push('/services')">
            Cancel
          </UButton>
          <UButton type="submit" color="emerald" :loading="saving">
            Create service
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

const form = reactive({
  nameEn: "",
  nameAr: "",
  summaryEn: "",
  summaryAr: "",
  slug: ""
});

const saving = ref(false);
const slugManuallyEdited = ref(false);

watch(
  () => form.nameEn,
  value => {
    if (!slugManuallyEdited.value) {
      form.slug = slugify(value ?? "");
    }
  },
  { immediate: true }
);

watch(
  () => form.slug,
  value => {
    slugManuallyEdited.value = value.trim() !== slugify(form.nameEn);
  }
);

function slugify(input: string): string {
  return (input ?? "")
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function handleSave() {
  saving.value = true;
  const payload = {
    slug: form.slug.trim() || slugify(form.nameEn),
    nameEn: form.nameEn.trim(),
    nameAr: form.nameAr.trim() || null,
    summaryEn: form.summaryEn.trim() || null,
    summaryAr: form.summaryAr.trim() || null
  };

  try {
    if (!payload.nameEn) {
      throw new Error("English name is required");
    }

    await request("/services", {
      method: "POST",
      body: payload
    });

    toast.add({ title: "Service created" });
    router.push("/services");
  } catch (error: any) {
    toast.add({
      title: "Unable to create service",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    saving.value = false;
  }
}
</script>
