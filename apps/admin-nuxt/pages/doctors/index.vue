<template>
  <div class="space-y-10">
    <header class="flex flex-wrap items-end justify-between gap-6 rounded-4xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 px-10 py-12 text-white shadow-2xl">
      <div class="space-y-4">
        <UBadge color="white" variant="soft" class="text-emerald-900">Operations</UBadge>
        <div>
          <h1 class="text-4xl font-semibold tracking-tight">Manage doctors</h1>
          <p class="text-sm text-white/80">
            Keep provider profiles current so patients can find the right expertise across the clinic.
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <MetricCard
            title="Total doctors"
            :metric="doctors.length.toString()"
            change="Active"
            description="Providers listed in the directory"
          />
          <MetricCard
            title="Specialties"
            :metric="uniqueSpecialties"
            change="Represented"
            description="Distinct areas of care"
          />
          <MetricCard
            title="Languages"
            :metric="uniqueLanguages"
            change="Supported"
            description="Patient-facing communication"
          />
        </div>
      </div>
      <div class="flex items-center gap-3">
        <UButton variant="ghost" color="white" :loading="pending" @click="refresh">
          Refresh
        </UButton>
        <UButton icon="i-lucide-user-plus" color="white" class="text-emerald-700" @click="openCreate">
          Add doctor
        </UButton>
      </div>
    </header>

    <UCard class="shadow-card">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-widest text-slate-400">Directory</p>
            <h2 class="text-lg font-semibold text-slate-900">Published doctors</h2>
          </div>
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Search doctors"
            color="gray"
            class="w-full max-w-xs"
          />
        </div>
      </template>

      <div v-if="pending && !doctors.length" class="space-y-4">
        <USkeleton v-for="i in 5" :key="`doctor-skeleton-${i}`" class="h-12 rounded-2xl" />
      </div>

      <div v-else-if="!filteredRows.length" class="rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
        <div class="mx-auto max-w-md space-y-4">
          <UAvatar icon="i-lucide-stethoscope" size="xl" class="mx-auto" color="gray" variant="soft" />
          <h3 class="text-xl font-semibold text-slate-900">No doctors found</h3>
          <p class="text-sm text-slate-500">
            Add a new practitioner or adjust your search filters to see results.
          </p>
          <UButton icon="i-lucide-user-plus" color="emerald" variant="soft" @click="openCreate">
            Create doctor
          </UButton>
        </div>
      </div>

      <UTable
        v-else
        :rows="filteredRows"
        :columns="columns"
        :loading="pending"
        class="rounded-2xl"
      >
        <template #fullName-data="{ row }">
          <div class="flex flex-col">
            <span class="font-medium text-slate-900">{{ row.fullName }}</span>
            <span v-if="row.specialty" class="text-xs text-slate-500">{{ row.specialty }}</span>
          </div>
        </template>
        <template #locales-data="{ row }">
          <div class="flex flex-wrap gap-2">
            <UBadge v-for="code in row.locales" :key="code" color="emerald" variant="soft" class="uppercase">
              {{ code }}
            </UBadge>
            <span v-if="!row.locales.length" class="text-xs text-slate-400">—</span>
          </div>
        </template>
        <template #services-data="{ row }">
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="service in row.services"
              :key="service.id"
              color="gray"
              variant="soft"
              class="max-w-[150px] truncate bg-slate-100 text-slate-600"
            >
              {{ service.nameEn ?? service.slug }}
            </UBadge>
            <span v-if="!row.services.length" class="text-xs text-slate-400">—</span>
          </div>
        </template>
        <template #createdAt-data="{ row }">
          <span class="text-xs text-slate-500">{{ row.createdAt }}</span>
        </template>
        <template #actions-data="{ row }">
          <div class="flex justify-end gap-2">
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              color="gray"
              size="xs"
              class="hover:bg-emerald-50"
              aria-label="Edit"
              @click="openEdit(row)"
            />
            <UButton
              icon="i-lucide-trash-2"
              variant="ghost"
              color="red"
              size="xs"
              class="hover:bg-red-50"
              aria-label="Delete"
              @click="confirmRemove(row)"
            />
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="deleteOpen" :ui="deleteModalUi">
      <UCard class="border-0 shadow-card">
        <template #header>
          <div>
            <p class="text-sm font-medium text-red-600">Delete doctor</p>
            <h3 class="text-xl font-semibold text-slate-900">This action cannot be reversed</h3>
            <p class="mt-1 text-sm text-slate-500">
              Removing a doctor disconnects them from all services and hides them from bookings.
            </p>
          </div>
        </template>
        <p class="text-sm text-slate-600">
          Are you sure you want to delete <strong>{{ deleteTarget?.fullName }}</strong>?
        </p>
        <div class="mt-6 flex justify-end gap-3">
          <UButton variant="ghost" color="gray" :disabled="deleting" @click="deleteOpen = false">
            Cancel
          </UButton>
          <UButton color="red" :loading="deleting" @click="handleDelete">
            Delete
          </UButton>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { DoctorAdmin } from "@/types/doctors";

const toast = useToast();
const { fetcher, request } = useAdminApi();

useHead({
  title: "Doctors – Clinic Admin"
});

const { data, pending, refresh } = await useAsyncData("admin-doctors", () =>
  fetcher<DoctorAdmin[]>("/doctors", [])
);

const doctors = computed(() => data.value ?? []);

const uniqueSpecialties = computed(() => {
  const specialties = new Set(
    doctors.value
      .map(doctor => doctor.specialty?.trim())
      .filter((value): value is string => Boolean(value))
  );
  return specialties.size.toString();
});

const uniqueLanguages = computed(() => {
  const codes = new Set(doctors.value.flatMap(doctor => doctor.locales ?? []));
  return codes.size.toString();
});

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

const rows = computed(() =>
  doctors.value.map(doctor => ({
    ...doctor,
    createdAt: doctor.createdAt ? dateFormatter.format(new Date(doctor.createdAt)) : "—"
  }))
);

const search = ref("");

const filteredRows = computed(() => {
  if (!search.value.trim()) {
    return rows.value;
  }
  const term = search.value.toLowerCase();
  return rows.value.filter(row =>
    [
      row.fullName,
      row.specialty,
      row.locales?.join(" "),
      row.services.map(service => service.nameEn ?? service.slug).join(" ")
    ]
      .filter(Boolean)
      .some(value => value?.toLowerCase().includes(term))
  );
});

const columns = [
  { key: "fullName", label: "Doctor", sortable: true },
  { key: "locales", label: "Languages", class: "max-w-xs" },
  { key: "services", label: "Services", class: "max-w-md" },
  { key: "createdAt", label: "Created" },
  { key: "actions", label: "", class: "w-24 text-right" }
];

const deleteOpen = ref(false);
const deleting = ref(false);
const deleteModalUi = {
  container: "flex min-h-full items-center justify-center text-center"
};

const deleteTarget = ref<DoctorAdmin | null>(null);
const router = useRouter();

function openCreate() {
  router.push("/doctors/new");
}

function openEdit(row: DoctorAdmin) {
  router.push(`/doctors/${row.id}`);
}

function confirmRemove(row: DoctorAdmin) {
  deleteTarget.value = row;
  deleteOpen.value = true;
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await request(`/doctors/${deleteTarget.value.id}`, {
      method: "DELETE"
    });
    toast.add({ title: "Doctor deleted" });
    deleteOpen.value = false;
    deleteTarget.value = null;
    await refresh();
  } catch (error: any) {
    toast.add({
      title: "Unable to delete doctor",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    deleting.value = false;
  }
}
</script>
