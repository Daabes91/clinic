<template>
  <div class="space-y-8">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-8 text-white shadow-xl">
      <div class="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-emerald-300/25 blur-2xl"></div>

      <div class="relative space-y-6">
        <UBreadcrumb
          :links="[
            { label: 'Services', to: '/services' },
            { label: 'New service' }
          ]"
          class="text-emerald-100"
        />
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="space-y-2">
            <UBadge color="white" variant="soft" size="md" class="text-emerald-700">
              <UIcon name="i-lucide-layers" class="h-3.5 w-3.5" />
              Create service
            </UBadge>
            <h1 class="text-3xl font-bold lg:text-4xl">Add a new clinic service</h1>
            <p class="max-w-2xl text-emerald-100">
              Provide localized names and descriptions that surface in the booking experience and public catalogue.
            </p>
          </div>
          <UButton variant="ghost" color="white" class="hover:bg-white/20" @click="router.push('/services')">
            Cancel
          </UButton>
        </div>
      </div>
    </div>

    <UCard class="mx-auto max-w-4xl space-y-8 shadow-card">
      <form class="space-y-8" @submit.prevent="handleSave">
        <div>
          <h2 class="text-lg font-semibold text-slate-900">Service identity</h2>
          <p class="mt-1 text-sm text-slate-500">Names appear across the admin dashboard and public booking flow.</p>
          <div class="mt-6 grid gap-5 md:grid-cols-2">
            <UFormGroup label="Name (English)" required>
              <UInput v-model="form.nameEn" placeholder="Teeth whitening" size="lg" />
            </UFormGroup>
            <UFormGroup label="Name (Arabic)">
              <UInput v-model="form.nameAr" placeholder="" dir="auto" size="lg" />
            </UFormGroup>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-slate-900">Website summary</h2>
          <p class="mt-1 text-sm text-slate-500">
            Short descriptions help patients understand what the service covers.
          </p>
          <div class="mt-6 grid gap-5 md:grid-cols-2">
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
        </div>

        <div>
          <h2 class="text-lg font-semibold text-slate-900">URL & metadata</h2>
          <p class="mt-1 text-sm text-slate-500">Customize the slug so links stay readable and localized.</p>
          <div class="mt-4">
            <UFormGroup label="Slug" hint="Used in the public URL" required>
              <UInput v-model="form.slug" placeholder="teeth-whitening" size="lg" />
            </UFormGroup>
          </div>
        </div>

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
