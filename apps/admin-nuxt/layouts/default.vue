<template>
  <div class="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/80 to-violet-50/30">
    <!-- Sidebar -->
    <aside class="hidden w-72 flex-col border-r border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-xl shadow-slate-200/40 lg:flex">
      <!-- Logo / Branding -->
      <div class="flex h-20 items-center gap-3.5 border-b border-slate-200/60 px-6 bg-gradient-to-r from-white to-slate-50/50">
        <div class="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-violet-600 to-violet-700 text-2xl shadow-lg shadow-violet-300/50 transition-transform duration-300 hover:scale-105">
          🦷
          <div class="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 opacity-20 blur-sm"></div>
        </div>
        <div class="flex-1">
          <p class="text-xs font-bold uppercase tracking-widest text-violet-600">Clinic Admin</p>
          <p class="text-sm font-bold text-slate-900">Operations Hub</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto px-4 py-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
        <UVerticalNavigation :links="navigation" :ui="navUi" />
      </nav>

      <!-- Support Card -->
      <div class="border-t border-slate-200/60 p-4 bg-gradient-to-b from-white to-slate-50/50">
        <div class="relative overflow-hidden rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50 via-white to-violet-50/50 p-4 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
          <div class="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-violet-200/40 to-transparent rounded-bl-full"></div>
          <div class="relative flex items-start gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-violet-700 text-white shadow-md">
              <UIcon name="i-lucide-headphones" class="h-5 w-5" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-slate-900">Need Support?</p>
              <p class="mt-0.5 text-xs text-slate-600 leading-relaxed">Available 24/7 to assist</p>
              <UButton
                color="violet"
                variant="soft"
                size="sm"
                class="mt-3 w-full shadow-sm hover:shadow-md transition-all duration-200"
                icon="i-lucide-mail"
              >
                Contact us
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex min-h-screen flex-1 flex-col">
      <!-- Header -->
      <header class="sticky top-0 z-30 border-b border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-sm">
        <UContainer class="flex h-20 items-center justify-between gap-4 px-6">
          <!-- Search & Mobile Menu -->
          <div class="flex flex-1 items-center gap-3">
            <UButton
              icon="i-lucide-menu"
              variant="ghost"
              size="md"
              class="lg:hidden hover:bg-violet-50 transition-colors"
              @click="sidebarOpen = true"
            />
            <div class="relative flex-1 max-w-2xl">
              <UInput
                v-model="search"
                icon="i-lucide-search"
                placeholder="Search patients, doctors, or appointments..."
                class="w-full"
                size="md"
                :ui="{
                  icon: { leading: { wrapper: 'absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none', icon: 'text-slate-400' } },
                  base: 'shadow-sm hover:shadow-md focus-within:shadow-md transition-shadow duration-200'
                }"
              />
              <kbd class="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded items-center gap-1">
                <span>⌘</span><span>K</span>
              </kbd>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <!-- Notifications -->
            <UButton
              icon="i-lucide-bell"
              variant="ghost"
              size="md"
              class="relative hover:bg-violet-50 transition-colors"
            >
              <span class="absolute right-2 top-2 flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500 ring-2 ring-white"></span>
              </span>
            </UButton>

            <!-- Quick Actions Dropdown -->
            <UDropdown :items="quickActions" :ui="dropdownUi">
              <UButton
                icon="i-lucide-zap"
                variant="ghost"
                size="md"
                class="hover:bg-violet-50 transition-colors"
              />
            </UDropdown>

            <!-- New Booking CTA -->
            <UButton
              icon="i-lucide-calendar-plus"
              color="violet"
              size="md"
              class="shadow-md shadow-violet-200/50 hover:shadow-lg hover:shadow-violet-300/50 transition-all duration-200 hover:scale-[1.02]"
              @click="navigateTo('/appointments/new')"
            >
              <span class="hidden sm:inline">New Booking</span>
            </UButton>

            <!-- Divider -->
            <div class="h-6 w-px bg-slate-200 mx-1"></div>

            <!-- User Menu -->
            <UDropdown :items="userMenu" :ui="dropdownUi">
              <UButton variant="ghost" size="md" class="gap-2.5 hover:bg-violet-50 transition-colors group">
                <UAvatar
                  size="sm"
                  icon="i-lucide-user"
                  :ui="{ rounded: 'rounded-lg', background: 'bg-gradient-to-br from-violet-600 to-violet-700' }"
                  class="ring-2 ring-violet-200 group-hover:ring-violet-300 transition-all"
                />
                <div class="hidden lg:flex flex-col items-start">
                  <span class="text-xs font-semibold text-slate-900">{{ userInfo.name }}</span>
                  <span class="text-xs text-slate-500">{{ userInfo.role }}</span>
                </div>
                <UIcon name="i-lucide-chevron-down" class="hidden lg:block h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </UButton>
            </UDropdown>
          </div>
        </UContainer>
      </header>

      <!-- Mobile Sidebar -->
      <USlideover v-model="sidebarOpen" side="left" :ui="{ width: 'max-w-sm' }">
        <UCard class="flex h-full flex-col" :ui="{ body: { padding: '' }, header: { padding: 'px-6 py-5' } }">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 text-xl shadow-md">
                  🦷
                </div>
                <div>
                  <span class="text-base font-bold text-slate-900">Clinic Admin</span>
                  <p class="text-xs text-slate-500">Operations Hub</p>
                </div>
              </div>
              <UButton icon="i-lucide-x" variant="ghost" size="sm" @click="sidebarOpen = false" />
            </div>
          </template>
          <nav class="flex-1 overflow-y-auto px-4 py-6">
            <UVerticalNavigation :links="navigation" :ui="navUi" />
          </nav>
        </UCard>
      </USlideover>

      <!-- Page Content with Animation -->
      <main class="flex-1 bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
        <UContainer class="py-10 px-6 max-w-[1600px]">
          <div class="shadow-sm rounded-xl">
            <slot />
          </div>
        </UContainer>
      </main>

      <!-- Footer -->
      <footer class="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <UContainer class="flex h-14 items-center justify-between px-6 text-xs text-slate-600">
          <p>&copy; 2025 Clinic Admin. All rights reserved.</p>
          <div class="flex items-center gap-4">
            <a href="#" class="hover:text-violet-600 transition-colors">Privacy</a>
            <a href="#" class="hover:text-violet-600 transition-colors">Terms</a>
            <a href="#" class="hover:text-violet-600 transition-colors">Documentation</a>
          </div>
        </UContainer>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuth();
const router = useRouter();
const search = ref("");
const sidebarOpen = ref(false);

// User info (would be fetched from auth state in production)
const userInfo = computed(() => ({
  name: auth.user?.value?.name || "Admin User",
  role: auth.user?.value?.role || "Administrator"
}));

// Enhanced navigation UI with modern styling
const navUi = {
  wrapper: "space-y-2",
  base: "group relative flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 overflow-hidden",
  active: "bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-300/40",
  inactive: "text-slate-700 hover:bg-gradient-to-r hover:from-violet-50 hover:to-violet-100/50 hover:text-violet-900",
  icon: {
    base: "h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
    active: "text-white",
    inactive: "text-slate-500 group-hover:text-violet-600"
  },
  badge: {
    base: "ml-auto",
    size: "text-xs",
    color: "primary"
  }
};

// Enhanced dropdown UI
const dropdownUi = {
  container: "z-50",
  width: "w-56",
  background: "bg-white",
  shadow: "shadow-xl shadow-slate-200/60",
  rounded: "rounded-xl",
  ring: "ring-1 ring-slate-200/80",
  padding: "p-1.5",
  item: {
    base: "group flex items-center gap-2.5 w-full transition-all duration-150",
    padding: "px-3 py-2.5",
    size: "text-sm",
    rounded: "rounded-lg",
    active: "bg-violet-50 text-violet-900",
    inactive: "text-slate-700 hover:bg-slate-50",
    disabled: "opacity-50 cursor-not-allowed",
    label: "font-medium truncate",
    icon: {
      base: "flex-shrink-0 w-5 h-5",
      active: "text-violet-600",
      inactive: "text-slate-500 group-hover:text-slate-700"
    }
  },
  separator: "h-px bg-slate-200 my-1.5"
};

// Navigation items with badges
const navigation = computed(() => [
  {
    label: "Dashboard",
    icon: "i-lucide-layout-dashboard",
    to: "/",
    badge: undefined
  },
  {
    label: "Appointments",
    icon: "i-lucide-calendar-check",
    to: "/appointments",
    badge: "12" // Example: show count of pending appointments
  },
  {
    label: "Doctors",
    icon: "i-lucide-stethoscope",
    to: "/doctors"
  },
  {
    label: "Patients",
    icon: "i-lucide-users",
    to: "/patients"
  },
  {
    label: "Services",
    icon: "i-lucide-layers",
    to: "/services"
  },
  {
    label: "Reports",
    icon: "i-lucide-bar-chart-3",
    to: "/reports"
  },
  {
    label: "Settings",
    icon: "i-lucide-settings",
    to: "/settings"
  }
]);

// Quick actions dropdown
const quickActions = [
  [
    {
      label: "New Patient",
      icon: "i-lucide-user-plus",
      click: () => navigateTo("/patients/new"),
      shortcuts: ["N", "P"]
    },
    {
      label: "New Doctor",
      icon: "i-lucide-user-cog",
      click: () => navigateTo("/doctors/new")
    },
    {
      label: "New Service",
      icon: "i-lucide-plus-circle",
      click: () => navigateTo("/services/new")
    }
  ]
];

// User menu with enhanced structure
const userMenu = [
  [
    {
      label: "Your Profile",
      icon: "i-lucide-user",
      to: "/settings",
      shortcuts: ["⌘", "P"]
    },
    {
      label: "Preferences",
      icon: "i-lucide-sliders",
      to: "/settings"
    },
    {
      label: "Notifications",
      icon: "i-lucide-bell",
      to: "/notifications",
      badge: "3"
    }
  ],
  [
    {
      label: "Documentation",
      icon: "i-lucide-book-open",
      click: () => window.open("https://docs.example.com", "_blank")
    },
    {
      label: "Support",
      icon: "i-lucide-life-buoy",
      click: () => {} // Open support modal
    }
  ],
  [
    {
      label: "Sign Out",
      icon: "i-lucide-log-out",
      click: async () => {
        try {
          await auth.logout();
        } finally {
          await navigateTo("/login");
        }
      }
    }
  ]
];

// Watch route changes and close mobile sidebar
const route = useRoute();
watch(() => route.path, () => {
  sidebarOpen.value = false;
});

// Keyboard shortcuts handler
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    // ⌘K or Ctrl+K for search
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      // Focus search input
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
      searchInput?.focus();
    }
  };

  window.addEventListener("keydown", handleKeydown);

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
});
</script>
