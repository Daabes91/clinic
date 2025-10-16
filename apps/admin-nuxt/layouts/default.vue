<template>
  <UApp>
    <div class="flex min-h-screen bg-slate-50">
      <aside class="hidden w-72 flex-col border-r border-slate-200 bg-white/80 px-6 py-8 backdrop-blur lg:flex">
        <div class="flex items-center gap-3">
          <UAvatar icon="i-lucide-tooth" size="lg" class="bg-violet-100 text-violet-600" />
          <div>
            <p class="text-xs uppercase tracking-widest text-slate-400">Clinic Admin</p>
            <p class="text-base font-semibold text-slate-900">Operations Hub</p>
          </div>
        </div>
        <UDivider class="my-6" />
        <UVerticalNavigation :links="navigation" class="flex-1" />
        <UDivider class="my-6" />
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p class="font-semibold text-slate-800">Need support?</p>
          <p class="mt-1">Email <span class="font-medium text-slate-900">ops@clinic.com</span></p>
          <UButton color="violet" variant="soft" block class="mt-3" icon="i-lucide-life-buoy">
            Open help center
          </UButton>
        </div>
      </aside>

      <div class="flex min-h-screen flex-1 flex-col">
        <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
          <UContainer class="flex items-center justify-between gap-4 py-4">
            <div class="flex flex-1 items-center gap-3">
              <UButton icon="i-lucide-menu" variant="ghost" class="lg:hidden" @click="sidebarOpen = true" />
              <UInput
                v-model="search"
                icon="i-lucide-search"
                placeholder="Search patients, doctors, or plans"
                class="w-full max-w-xl"
              />
            </div>
            <div class="flex items-center gap-3">
              <UButton icon="i-lucide-calendar-plus" color="violet" @click="navigateTo('/appointments/new')">
                New booking
              </UButton>
              <UDropdown :items="userMenu">
                <UAvatar size="sm" class="cursor-pointer" icon="i-lucide-user" />
              </UDropdown>
            </div>
          </UContainer>
        </header>

        <UModal v-model="sidebarOpen" size="xl" fullscreen class="lg:hidden">
          <UCard class="flex h-full flex-col">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UAvatar icon="i-lucide-tooth" size="md" class="bg-violet-100 text-violet-600" />
                  <span class="text-base font-semibold text-slate-900">Clinic Admin</span>
                </div>
                <UButton icon="i-lucide-x" variant="ghost" @click="sidebarOpen = false" />
              </div>
            </template>
            <UVerticalNavigation :links="navigation" class="flex-1" @select="sidebarOpen = false" />
          </UCard>
        </UModal>

        <main class="flex-1">
          <UContainer class="py-8">
            <slot />
          </UContainer>
        </main>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
const search = ref("");
const sidebarOpen = ref(false);

const navigation = [
  {
    label: "Overview",
    children: [
      { label: "Dashboard", icon: "i-lucide-layout-dashboard", to: "/" },
      { label: "Appointments", icon: "i-lucide-calendar-days", to: "/appointments" },
      { label: "Patients", icon: "i-lucide-users", to: "/patients" }
    ]
  },
  {
    label: "Operations",
    children: [
      { label: "Doctors", icon: "i-lucide-stethoscope", to: "/doctors" },
      { label: "Services", icon: "i-lucide-layers", to: "/services" },
      { label: "Reports", icon: "i-lucide-bar-chart-3", to: "/reports" }
    ]
  },
  {
    label: "Settings",
    children: [
      { label: "Clinic settings", icon: "i-lucide-settings", to: "/settings" }
    ]
  }
];

const userMenu = [
  [
    { label: "Profile", icon: "i-lucide-user", to: "/settings" },
    { label: "Notifications", icon: "i-lucide-bell", to: "/notifications" }
  ],
  [
    { label: "Sign out", icon: "i-lucide-log-out", to: "/logout" }
  ]
];
</script>
