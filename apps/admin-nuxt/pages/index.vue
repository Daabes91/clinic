<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Hero Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 p-6 text-white shadow-xl shadow-violet-300/30">
      <!-- Enhanced Decorative elements -->
      <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl"></div>
      <div class="absolute top-1/2 right-1/4 h-32 w-32 rounded-full bg-purple-400/10 blur-2xl"></div>

      <div class="relative">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <UBadge color="white" variant="soft" size="sm" class="text-violet-700">
                <UIcon name="i-lucide-calendar" class="h-3 w-3" />
                Today
              </UBadge>
              <span class="text-xs font-medium text-violet-200">
                {{ todayDate }}
              </span>
            </div>
            <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">
              Welcome back! 👋
            </h1>
            <p class="text-sm font-medium text-violet-100 max-w-2xl">
              Here's what's happening with your clinic today
            </p>
          </div>

          <UButton
            icon="i-lucide-calendar-plus"
            color="white"
            size="md"
            class="!text-violet-700 shadow-lg shadow-white/20 hover:shadow-xl hover:scale-105 transition-all duration-200"
            @click="navigateTo('/appointments/new')"
          >
            <span class="text-violet-700 font-semibold">New Appointment</span>
          </UButton>
        </div>

        <!-- Quick Stats -->
        <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div class="group relative overflow-hidden rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:shadow-xl hover:shadow-white/10 cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold text-violet-200">Appointments</p>
                <p class="mt-2 text-2xl font-bold tracking-tight">{{ summary.appointmentsToday }}</p>
                <p class="mt-1 text-xs font-medium text-violet-300">Today's schedule</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                <UIcon name="i-lucide-calendar-check" class="h-5 w-5" />
              </div>
            </div>
            <div class="absolute bottom-0 left-0 h-1 w-0 bg-white/40 transition-all duration-300 group-hover:w-full"></div>
          </div>

          <div class="group relative overflow-hidden rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:shadow-xl hover:shadow-white/10 cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold text-violet-200">Pending</p>
                <p class="mt-2 text-2xl font-bold tracking-tight">{{ summary.pendingConfirmations }}</p>
                <div class="mt-1 flex items-center gap-1">
                  <UIcon name="i-lucide-arrow-up" class="h-3 w-3 text-emerald-300" />
                  <span class="text-xs font-semibold text-emerald-300">+2</span>
                  <span class="text-xs text-violet-300">vs yesterday</span>
                </div>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                <UIcon name="i-lucide-clock" class="h-5 w-5" />
              </div>
            </div>
            <div class="absolute bottom-0 left-0 h-1 w-0 bg-white/40 transition-all duration-300 group-hover:w-full"></div>
          </div>

          <div class="group relative overflow-hidden rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:shadow-xl hover:shadow-white/10 cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold text-violet-200">Revenue (MTD)</p>
                <p class="mt-2 text-xl font-bold tracking-tight">
                  {{ Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', notation: 'compact' }).format(summary.revenueMonthToDate) }}
                </p>
                <p class="mt-1 text-xs font-medium text-violet-300">Month to date</p>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                <UIcon name="i-lucide-trending-up" class="h-5 w-5" />
              </div>
            </div>
            <div class="absolute bottom-0 left-0 h-1 w-0 bg-white/40 transition-all duration-300 group-hover:w-full"></div>
          </div>

          <div class="group relative overflow-hidden rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:scale-105 hover:shadow-xl hover:shadow-white/10 cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold text-violet-200">New Patients</p>
                <p class="mt-2 text-2xl font-bold tracking-tight">{{ summary.newPatients }}</p>
                <div class="mt-1 flex items-center gap-1">
                  <UIcon name="i-lucide-arrow-up" class="h-3 w-3 text-emerald-300" />
                  <span class="text-xs font-semibold text-emerald-300">+5</span>
                  <span class="text-xs text-violet-300">last 7 days</span>
                </div>
              </div>
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                <UIcon name="i-lucide-user-plus" class="h-5 w-5" />
              </div>
            </div>
            <div class="absolute bottom-0 left-0 h-1 w-0 bg-white/40 transition-all duration-300 group-hover:w-full"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Upcoming Appointments -->
      <div class="lg:col-span-2">
        <UCard class="shadow-md shadow-slate-200/50 border-0">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-violet-200 text-violet-600">
                  <UIcon name="i-lucide-calendar-days" class="h-5 w-5" />
                </div>
                <div>
                  <h2 class="text-lg font-bold text-slate-900">Upcoming Appointments</h2>
                  <p class="text-xs font-medium text-slate-500">Next 5 scheduled visits</p>
                </div>
              </div>
              <UBadge color="violet" variant="soft" size="md" class="px-3 py-1">
                {{ upcoming.length }} scheduled
              </UBadge>
            </div>
          </template>

          <div v-if="!upcoming || upcoming.length === 0" class="text-center py-12">
            <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 mx-auto mb-4">
              <UIcon name="i-lucide-calendar-x" class="h-10 w-10" />
            </div>
            <p class="text-lg font-semibold text-slate-900">No upcoming appointments</p>
            <p class="text-sm text-slate-500 mt-2">Schedule a new appointment to get started</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(appointment, index) in upcoming"
              :key="appointment?.id || index"
              class="group relative overflow-hidden rounded-lg border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/30 to-white p-3 transition-all duration-300 hover:border-violet-400 hover:shadow-md hover:shadow-violet-100/50 cursor-pointer"
              @click="appointment?.id && navigateTo(`/appointments/${appointment.id}`)"
            >
              <div class="flex items-center gap-3">
                <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-md shadow-violet-300/40">
                  <UIcon name="i-lucide-user" class="h-5 w-5" />
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-bold text-slate-900 truncate group-hover:text-violet-700 transition-colors">
                        {{ appointment?.patientName || appointment?.patient?.name || '—' }}
                      </p>
                      <p class="text-xs font-medium text-slate-600 truncate mt-0.5">
                        {{ appointment?.serviceName || appointment?.service?.name || '—' }}
                      </p>
                      <div class="flex items-center gap-1 mt-1">
                        <UIcon name="i-lucide-stethoscope" class="h-3 w-3 text-slate-400" />
                        <span class="text-xs text-slate-500">{{ appointment?.doctorName || appointment?.doctor?.name || '—' }}</span>
                      </div>
                    </div>

                    <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <UBadge :color="statusColor(appointment?.status)" variant="soft" size="sm">
                        {{ formatStatus(appointment?.status) }}
                      </UBadge>
                      <div class="text-right bg-slate-50 rounded px-2 py-1 border border-slate-200">
                        <p class="text-xs font-bold text-slate-900">
                          {{ formatTime(appointment?.scheduledAt || appointment?.scheduled_at) }}
                        </p>
                        <p class="text-xs text-slate-500">
                          {{ formatDate(appointment?.scheduledAt || appointment?.scheduled_at) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Enhanced Hover indicator -->
              <div class="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-violet-500 via-violet-600 to-purple-600 transition-all duration-300 group-hover:w-full"></div>
            </div>

            <UButton
              variant="ghost"
              block
              class="mt-4 text-violet-700 hover:bg-violet-50 font-semibold py-2 rounded-lg transition-all duration-200"
              @click="navigateTo('/appointments')"
            >
              View all appointments
              <template #trailing>
                <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
              </template>
            </UButton>
          </div>
        </UCard>
      </div>

      <!-- Doctors on Call -->
      <div>
        <UCard class="shadow-md shadow-slate-200/50 border-0">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600">
                <UIcon name="i-lucide-stethoscope" class="h-5 w-5" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-900">Doctors on Call</h2>
                <p class="text-xs font-medium text-slate-500">Available today</p>
              </div>
            </div>
          </template>

          <div class="space-y-3">
            <div
              v-for="doctor in doctors"
              :key="doctor.name"
              class="group relative overflow-hidden rounded-lg border border-slate-200/80 bg-gradient-to-br from-white via-emerald-50/20 to-white p-3 transition-all duration-300 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-100/50"
            >
              <div class="flex items-start gap-3">
                <UAvatar
                  :alt="doctor.name"
                  size="md"
                  class="ring-2 ring-emerald-100 group-hover:ring-emerald-200 transition-all"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{{ doctor.name }}</p>
                  <p class="text-xs text-slate-600 truncate mt-0.5">{{ doctor.specialty }}</p>
                  <div class="mt-2 flex items-center gap-1.5 bg-emerald-50 rounded px-2 py-1 w-fit border border-emerald-200">
                    <div class="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span class="text-xs font-semibold text-emerald-700">{{ doctor.status }}</span>
                  </div>
                  <div class="mt-2 flex items-center gap-1 text-xs text-slate-500">
                    <UIcon name="i-lucide-clock" class="h-3 w-3" />
                    <span>Next: <span class="text-slate-700 font-semibold">{{ doctor.nextSlot }}</span></span>
                  </div>
                </div>
              </div>
              <div class="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300 group-hover:w-full"></div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Channel Performance -->
      <div class="lg:col-span-2">
        <UCard class="shadow-md shadow-slate-200/50 border-0">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600">
                <UIcon name="i-lucide-activity" class="h-5 w-5" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-900">Engagement Pulse</h2>
                <p class="text-xs font-medium text-slate-500">Channel performance metrics</p>
              </div>
            </div>
          </template>

          <div class="grid gap-3 md:grid-cols-3">
            <div class="group relative overflow-hidden rounded-lg border border-blue-200/60 bg-gradient-to-br from-blue-50 via-white to-blue-50/30 p-4 transition-all duration-300 hover:border-blue-400 hover:shadow-md hover:shadow-blue-100/50">
              <div class="flex items-center gap-2 text-blue-600">
                <div class="p-1.5 bg-blue-100 rounded-md">
                  <UIcon name="i-lucide-message-circle" class="h-4 w-4" />
                </div>
                <p class="text-xs font-bold uppercase tracking-wide">WhatsApp</p>
              </div>
              <p class="mt-3 text-2xl font-bold text-slate-900 tracking-tight">92%</p>
              <div class="mt-2 flex items-center gap-1 text-xs">
                <UIcon name="i-lucide-trending-up" class="h-3 w-3 text-emerald-600" />
                <span class="font-bold text-emerald-600">+6%</span>
                <span class="text-slate-500">this week</span>
              </div>
              <p class="mt-2 text-xs text-slate-600">Opening reminders within 2h</p>
              <div class="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></div>
            </div>

            <div class="group relative overflow-hidden rounded-lg border border-purple-200/60 bg-gradient-to-br from-purple-50 via-white to-purple-50/30 p-4 transition-all duration-300 hover:border-purple-400 hover:shadow-md hover:shadow-purple-100/50">
              <div class="flex items-center gap-2 text-purple-600">
                <div class="p-1.5 bg-purple-100 rounded-md">
                  <UIcon name="i-lucide-mail" class="h-4 w-4" />
                </div>
                <p class="text-xs font-bold uppercase tracking-wide">Email</p>
              </div>
              <p class="mt-3 text-2xl font-bold text-slate-900 tracking-tight">81%</p>
              <div class="mt-2 flex items-center gap-1 text-xs">
                <UIcon name="i-lucide-trending-up" class="h-3 w-3 text-emerald-600" />
                <span class="font-bold text-emerald-600">+3%</span>
                <span class="text-slate-500">this week</span>
              </div>
              <p class="mt-2 text-xs text-slate-600">Confirmed by patients</p>
              <div class="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300 group-hover:w-full"></div>
            </div>

            <div class="group relative overflow-hidden rounded-lg border border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-amber-50/30 p-4 transition-all duration-300 hover:border-amber-400 hover:shadow-md hover:shadow-amber-100/50">
              <div class="flex items-center gap-2 text-amber-600">
                <div class="p-1.5 bg-amber-100 rounded-md">
                  <UIcon name="i-lucide-credit-card" class="h-4 w-4" />
                </div>
                <p class="text-xs font-bold uppercase tracking-wide">Payments</p>
              </div>
              <p class="mt-3 text-2xl font-bold text-slate-900 tracking-tight">65%</p>
              <div class="mt-2 flex items-center gap-1 text-xs">
                <UIcon name="i-lucide-trending-up" class="h-3 w-3 text-emerald-600" />
                <span class="font-bold text-emerald-600">+4%</span>
                <span class="text-slate-500">this week</span>
              </div>
              <p class="mt-2 text-xs text-slate-600">Response within 24h</p>
              <div class="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 group-hover:w-full"></div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Daily Goals -->
      <div>
        <UCard class="shadow-md shadow-slate-200/50 border-0">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-violet-200 text-violet-600">
                <UIcon name="i-lucide-target" class="h-5 w-5" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-slate-900">Daily Targets</h2>
                <p class="text-xs font-medium text-slate-500">Goals progress</p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <div class="group">
              <div class="flex items-center justify-between text-xs mb-2">
                <span class="font-bold text-slate-700">Confirmed Bookings</span>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded">79%</span>
                  <span class="font-bold text-slate-900">19/24</span>
                </div>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-violet-500 via-violet-600 to-violet-700 transition-all duration-700"
                  style="width: 79%"
                />
              </div>
            </div>

            <div class="group">
              <div class="flex items-center justify-between text-xs mb-2">
                <span class="font-bold text-slate-700">Outstanding Invoices</span>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">40%</span>
                  <span class="font-bold text-slate-900">2/5</span>
                </div>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 transition-all duration-700"
                  style="width: 40%"
                />
              </div>
            </div>

            <div class="group">
              <div class="flex items-center justify-between text-xs mb-2">
                <span class="font-bold text-slate-700">Treatment Updates</span>
                <div class="flex items-center gap-1.5">
                  <span class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">70%</span>
                  <span class="font-bold text-slate-900">7/10</span>
                </div>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-700"
                  style="width: 70%"
                />
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-200">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-slate-700">Overall Progress</span>
                <span class="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">63%</span>
              </div>
              <div class="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-600 to-purple-700"
                  style="width: 63%"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dashboardSummaryMock, upcomingAppointmentsMock } from "@/data/mock";

const { fetcher } = useAdminApi();
const router = useRouter();

useHead({
  title: "Dashboard – Clinic Admin"
});

const { data: summaryData } = await useAsyncData("dashboard-summary", () =>
  fetcher("/dashboard/summary", dashboardSummaryMock)
);
const summary = computed(() => summaryData.value ?? dashboardSummaryMock);

const { data: upcomingData } = await useAsyncData("upcoming-appointments", () =>
  fetcher("/appointments?filter=upcoming", upcomingAppointmentsMock)
);
const upcoming = computed(() => {
  const data = upcomingData.value ?? upcomingAppointmentsMock;
  console.log('Upcoming appointments data:', data);
  console.log('First appointment:', data?.[0]);

  let appointments = [];

  // Check if data is wrapped in an object or is an array directly
  if (Array.isArray(data)) {
    appointments = data;
  } else if (data && typeof data === 'object' && 'items' in data) {
    appointments = data.items;
  } else if (data && typeof data === 'object' && 'content' in data) {
    appointments = data.content;
  } else {
    appointments = upcomingAppointmentsMock;
  }

  // Return only first 5 appointments
  return appointments.slice(0, 5);
});

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

const formatDate = (date: string | number | null | undefined) => {
  if (!date) return "—";
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "—";
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric"
    }).format(dateObj);
  } catch {
    return "—";
  }
};

const formatTime = (date: string | number | null | undefined) => {
  if (!date) return "—";
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "—";
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit"
    }).format(dateObj);
  } catch {
    return "—";
  }
};

function formatStatus(status: string | undefined) {
  if (!status) return "—";
  return status.toLowerCase().replace('_', ' ');
}

function statusColor(status: string | undefined) {
  if (!status) return "gray";

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

const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
</script>