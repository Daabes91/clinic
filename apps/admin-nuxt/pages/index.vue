<template>
  <UPage>
    <UPageHeader
      title="Clinic Operations"
      description="Monitor bookings, patient follow-ups, and revenue performance in real time."
      :badge="{ label: 'Today', color: 'emerald' }"
    >
      <template #actions>
        <UButton icon="i-lucide-calendar-plus" color="violet" @click="navigateTo('/appointments/new')">
          New appointment
        </UButton>
      </template>
    </UPageHeader>

    <UPageBody>
      <UPageSection>
        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Appointments today" :value="summary.appointmentsToday" />
          <StatCard label="Pending confirmations" :value="summary.pendingConfirmations" trend="+2 vs yesterday" />
          <StatCard
            label="Revenue (MTD)"
            :value="Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(summary.revenueMonthToDate)"
          />
          <StatCard label="New patients" :value="summary.newPatients" trend="+5 last 7 days" />
        </div>
      </UPageSection>

      <UPageSection>
        <div class="grid gap-6 xl:grid-cols-3">
          <UCard class="xl:col-span-2">
            <template #header>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p class="text-xs uppercase tracking-widest text-slate-400">Upcoming</p>
                  <h2 class="text-lg font-semibold text-slate-900">Next appointments</h2>
                </div>
                <UBadge variant="soft" color="emerald">{{ upcoming.length }} scheduled</UBadge>
              </div>
            </template>
            <div class="space-y-3">
              <UCard
                v-for="appointment in upcoming"
                :key="appointment.id"
                class="border border-slate-200 shadow-none transition hover:border-emerald-200 hover:shadow-lg"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="grid h-12 w-12 place-content-center rounded-full bg-emerald-50 text-emerald-600">
                      <UIcon name="i-lucide-calendar-clock" class="h-5 w-5" />
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-slate-900">{{ appointment.patientName }}</p>
                      <p class="text-xs text-slate-500">
                        {{ appointment.serviceName }} · {{ appointment.doctorName }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-right text-xs text-slate-500">
                      <p class="font-medium text-slate-900">{{ formatTime(appointment.scheduledAt) }}</p>
                      <p>{{ formatDate(appointment.scheduledAt) }}</p>
                    </div>
                    <UBadge :color="statusColor(appointment.status)" variant="soft" class="capitalize">
                      {{ appointment.status.toLowerCase() }}
                    </UBadge>
                  </div>
                </div>
              </UCard>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div>
                <p class="text-xs uppercase tracking-widest text-slate-400">Doctors</p>
                <h2 class="text-lg font-semibold text-slate-900">On call today</h2>
              </div>
            </template>
            <div class="space-y-4">
              <DoctorCard
                v-for="doctor in doctors"
                :key="doctor.name"
                :name="doctor.name"
                :specialty="doctor.specialty"
                :status="doctor.status"
                :next-slot="doctor.nextSlot"
              />
            </div>
          </UCard>
        </div>
      </UPageSection>

      <UPageSection>
        <div class="grid gap-6 lg:grid-cols-3">
          <UCard class="lg:col-span-2">
            <template #header>
              <div>
                <p class="text-xs uppercase tracking-widest text-slate-400">Engagement pulse</p>
                <h2 class="text-lg font-semibold text-slate-900">Channel performance</h2>
              </div>
            </template>
            <div class="grid gap-4 md:grid-cols-3">
              <MetricCard
                title="WhatsApp reminders"
                metric="92%"
                change="+6%"
                description="Patients opening reminders within 2 hours."
              />
              <MetricCard
                title="Email confirmations"
                metric="81%"
                change="+3%"
                description="Delivered and acknowledged by patients."
              />
              <MetricCard
                title="Payment follow-ups"
                metric="65%"
                change="+4%"
                description="Patients responding within 24 hours."
              />
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div>
                <p class="text-xs uppercase tracking-widest text-slate-400">Daily targets</p>
                <h2 class="text-lg font-semibold text-slate-900">Goals progress</h2>
              </div>
            </template>
            <div class="space-y-4">
              <ProgressRow label="Confirmed bookings" :value="19" :target="24" />
              <ProgressRow label="Outstanding invoices" :value="2" :target="5" />
              <ProgressRow label="Treatment plan updates" :value="7" :target="10" />
            </div>
          </UCard>
        </div>
      </UPageSection>
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
import { dashboardSummaryMock, upcomingAppointmentsMock } from "@/data/mock";

const { fetcher } = useAdminApi();
const router = useRouter();

const { data: summaryData } = await useAsyncData("dashboard-summary", () =>
  fetcher("/dashboard/summary", dashboardSummaryMock)
);
const summary = computed(() => summaryData.value ?? dashboardSummaryMock);

const { data: upcomingData } = await useAsyncData("upcoming-appointments", () =>
  fetcher("/appointments?filter=upcoming", upcomingAppointmentsMock)
);
const upcoming = computed(() => upcomingData.value ?? upcomingAppointmentsMock);

const doctors = [
  {
    name: "Dr. Layla Rahman",
    specialty: "Cosmetic Dentistry",
    status: "In clinic",
    nextSlot: "10:30 AM"
  },
  {
    name: "Dr. Omar Idris",
    specialty: "Oral Surgery",
    status: "Post-op review",
    nextSlot: "11:15 AM"
  },
  {
    name: "Dr. Noor Haddad",
    specialty: "General Dentistry",
    status: "Consultation",
    nextSlot: "12:00 PM"
  }
];

const formatDate = (date: string | number) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric"
  }).format(new Date(date));

const formatTime = (date: string | number) =>
  new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(date));

function statusColor(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "emerald";
    case "COMPLETED":
      return "blue";
    case "CANCELLED":
      return "red";
    case "SCHEDULED":
    default:
      return "violet";
  }
}

function navigateTo(path: string) {
  router.push(path);
}
</script>
