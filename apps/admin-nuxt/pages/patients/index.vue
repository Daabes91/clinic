<template>
  <UPage>
    <UPageHeader
      title="Manage patients"
      description="Maintain accurate contact details to streamline scheduling, follow-ups, and reminders."
      :badge="{ label: 'Operations', color: 'blue' }"
    >
      <template #actions>
        <div class="flex items-center gap-2">
          <UButton variant="ghost" :loading="pending" @click="refresh">
            Refresh
          </UButton>
          <UButton icon="i-lucide-user-round-plus" color="blue" @click="openCreate">
            Add patient
          </UButton>
        </div>
      </template>
    </UPageHeader>

    <UPageBody>
      <UPageSection>
        <div class="grid gap-4 sm:grid-cols-3">
          <MetricCard title="Total patients" :metric="patients.length.toString()" change="Records" description="Active patient profiles" />
          <MetricCard title="New this month" :metric="newThisMonth" change="30 days" description="Recently added patients" />
          <MetricCard title="With email" :metric="withEmail" change="Reachable" description="Patients we can email" />
        </div>
      </UPageSection>

      <UPageSection>
        <UCard>
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-widest text-slate-400">Directory</p>
                <h2 class="text-lg font-semibold text-slate-900">Patient list</h2>
              </div>
              <UInput
                v-model="search"
                icon="i-lucide-search"
                placeholder="Search patients"
                class="w-full max-w-xs"
              />
            </div>
          </template>

          <div v-if="pending && !patients.length" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <USkeleton v-for="i in 6" :key="`patient-skeleton-${i}`" class="h-12 rounded-xl" />
          </div>

          <div v-else-if="!filteredRows.length" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
            <div class="mx-auto max-w-md space-y-4">
              <UAvatar icon="i-lucide-users" size="xl" class="mx-auto" color="gray" variant="soft" />
              <h3 class="text-xl font-semibold text-slate-900">No patients found</h3>
              <p class="text-sm text-slate-500">
                Add a new patient or adjust your search filters to see results.
              </p>
              <UButton icon="i-lucide-user-round-plus" color="emerald" variant="soft" @click="openCreate">
                Create patient
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
                <span class="text-xs text-slate-500">{{ row.externalId }}</span>
              </div>
            </template>
            <template #contact-data="{ row }">
              <div class="flex flex-col gap-1 text-xs text-slate-500">
                <span v-if="row.email">{{ row.email }}</span>
                <span v-else class="text-slate-400">No email</span>
                <span v-if="row.phone">{{ row.phone }}</span>
                <span v-else class="text-slate-400">No phone</span>
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
                  aria-label="Edit"
                  @click="openEdit(row)"
                />
                <UButton
                  icon="i-lucide-trash-2"
                  variant="ghost"
                  color="red"
                  size="xs"
                  aria-label="Delete"
                  @click="confirmRemove(row)"
                />
              </div>
            </template>
          </UTable>
        </UCard>
      </UPageSection>
    </UPageBody>

    <UModal v-model="deleteOpen" :ui="deleteModalUi">
      <UCard>
        <template #header>
          <div>
            <p class="text-sm font-medium text-red-600">Delete patient</p>
            <h3 class="text-xl font-semibold text-slate-900">This action cannot be reversed</h3>
            <p class="mt-1 text-sm text-slate-500">
              Deleting a patient removes their contact history and requires re-adding for future visits.
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
  </UPage>
</template>

<script setup lang="ts">
import type { PatientAdmin } from "@/types/patients";

useHead({
  title: "Patients – Clinic Admin"
});

const toast = useToast();
const { fetcher, request } = useAdminApi();
const router = useRouter();

const { data, pending, refresh } = await useAsyncData("patients", () =>
  fetcher<PatientAdmin[]>("/patients", [])
);

const patients = computed(() => data.value ?? []);

const newThisMonth = computed(() => {
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const count = patients.value.filter(patient => {
    if (!patient.createdAt) return false;
    return new Date(patient.createdAt).getTime() >= cutoff;
  }).length;
  return count.toString();
});

const withEmail = computed(() =>
  patients.value.filter(patient => Boolean(patient.email?.trim())).length.toString()
);

const search = ref("");
const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

const rows = computed(() =>
  patients.value.map(patient => ({
    ...patient,
    fullName: `${patient.firstName} ${patient.lastName}`,
    createdAt: patient.createdAt ? dateFormatter.format(new Date(patient.createdAt)) : "—"
  }))
);

const filteredRows = computed(() => {
  if (!search.value.trim()) {
    return rows.value;
  }
  const term = search.value.toLowerCase();
  return rows.value.filter(row =>
    [row.fullName, row.email, row.phone, row.externalId]
      .filter(Boolean)
      .some(value => value?.toLowerCase().includes(term))
  );
});

const columns = [
  { key: "fullName", label: "Patient", sortable: true },
  { key: "contact", label: "Contact", class: "max-w-xs" },
  { key: "createdAt", label: "Created" },
  { key: "actions", label: "", class: "w-24 text-right" }
];

const deleteOpen = ref(false);
const deleteTarget = ref<{ id: number; fullName: string } | null>(null);
const deleting = ref(false);

const deleteModalUi = {
  overlay: { transition: { enterActiveClass: "" } }
};

function openCreate() {
  router.push("/patients/new");
}

function openEdit(row: (typeof rows.value)[number]) {
  router.push(`/patients/${row.id}`);
}

function confirmRemove(row: (typeof rows.value)[number]) {
  deleteTarget.value = { id: row.id, fullName: row.fullName };
  deleteOpen.value = true;
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await request(`/patients/${deleteTarget.value.id}`, { method: "DELETE" });
    toast.add({ title: "Patient deleted" });
    deleteOpen.value = false;
    deleteTarget.value = null;
    await refresh();
  } catch (error: any) {
    toast.add({
      title: "Unable to delete patient",
      description: error?.data?.message ?? error?.message ?? "Unexpected error",
      color: "red"
    });
  } finally {
    deleting.value = false;
  }
}
</script>
