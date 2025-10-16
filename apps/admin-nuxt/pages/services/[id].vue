<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <header class="space-y-2">
      <UBreadcrumb
        :links="[
          { label: 'Services', to: '/services' },
          { label: service?.nameEn ?? service?.nameAr ?? 'Service details' }
        ]"
      />
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="space-y-1.5">
          <p class="text-sm font-medium text-emerald-600">Edit service</p>
          <h1 class="text-3xl font-semibold text-slate-900">
            {{ service?.nameEn || service?.nameAr || 'Loading service…' }}
          </h1>
          <p class="text-sm text-slate-500">
            Update localized names and summaries. Changes reflect immediately on the booking experience.
          </p>
        </div>
        <UButton variant="ghost" color="gray" @click="router.push('/services')">
          Back to services
        </UButton>
      </div>
    </header>

    <UAlert v-if="error" color="red" icon="i-lucide-alert-triangle">
      <template #title>Unable to load service</template>
      <template #description>
        {{ error.message || "We couldn't find that service. Return to the services catalogue and try again." }}
      </template>
    </UAlert>

    <UCard v-else class="shadow-card">
      <div v-if="pending" class="space-y-6">
        <USkeleton class="h-12 rounded-3xl" />
        <USkeleton class="h-32 rounded-3xl" />
        <USkeleton class="h-12 rounded-3xl" />
      </div>
      <form v-else class="space-y-6" @submit.prevent="handleSave">
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
            Save changes
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
const route = useRoute();
const { request } = useAdminApi();

const serviceId = computed(() => Number(route.params.id));

if (Number.isNaN(serviceId.value)) {
  throw createError({ statusCode: 404, statusMessage: "Service not found" });
}

const { data, pending, error } = await useAsyncData(
  `admin-service-${serviceId.value}`,
  async () => {
    return await request<AdminServiceSummary>(`/services/${serviceId.value}`);
  }
);

const service = computed(() => data.value ?? null);

const form = reactive({
  nameEn: "",
  nameAr: "",
  summaryEn: "",
  summaryAr: "",
  slug: ""
});

const slugManuallyEdited = ref(false);

watchEffect(() => {
  if (!service.value) return;
  form.nameEn = service.value.nameEn ?? "";
  form.nameAr = service.value.nameAr ?? "";
  form.summaryEn = service.value.summaryEn ?? "";
  form.summaryAr = service.value.summaryAr ?? "";
  form.slug = service.value.slug ?? "";
  slugManuallyEdited.value = false;
});

const saving = ref(false);

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

watch(
  () => form.nameEn,
  value => {
    if (!service.value || slugManuallyEdited.value) return;
    form.slug = slugify(value ?? "");
  }
);

watch(
  () => form.slug,
  value => {
    if (!service.value) return;
    slugManuallyEdited.value = value.trim() !== slugify(form.nameEn);
  }
);

async function handleSave() {
  if (!service.value) return;
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

    await request(`/services/${service.value.id}`, {
      method: "PUT",
      body: payload
    });

    toast.add({ title: "Service updated" });
    router.push("/services");
  } catch (error: any) {
    toast.add({
      title: "Unable to update service",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    saving.value = false;
  }
}
</script>
