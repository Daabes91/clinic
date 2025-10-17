<template>
  <div class="space-y-8">
    <!-- Hero Header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black p-8 text-white shadow-xl">
      <div class="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-slate-500/30 blur-2xl"></div>

      <div class="relative space-y-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="space-y-3">
            <UBadge color="white" variant="soft" size="md" class="text-slate-900">
              <UIcon name="i-lucide-user-cog" class="h-3.5 w-3.5" />
              Account Settings
            </UBadge>
            <h1 class="text-3xl font-bold lg:text-4xl">Profile Settings</h1>
            <p class="max-w-2xl text-slate-200">
              Manage your account information and preferences
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Information -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Profile Card -->
      <div class="lg:col-span-1">
        <UCard class="shadow-card">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                <UIcon name="i-lucide-user" class="h-5 w-5" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Your Profile</h2>
                <p class="text-sm text-slate-500">Account information</p>
              </div>
            </div>
          </template>

          <div v-if="loading" class="space-y-4">
            <USkeleton class="h-32 w-32 rounded-full mx-auto" />
            <USkeleton class="h-8 rounded-lg" />
            <USkeleton class="h-6 rounded-lg" />
          </div>

          <div v-else-if="error" class="py-8 text-center">
            <UIcon name="i-lucide-alert-triangle" class="h-12 w-12 text-red-500 mx-auto mb-3" />
            <p class="text-sm text-slate-600">{{ error }}</p>
            <UButton size="sm" color="violet" class="mt-4" @click="refresh">
              Try Again
            </UButton>
          </div>

          <div v-else-if="profile" class="space-y-6">
            <div class="flex justify-center">
              <UAvatar
                :alt="profile.fullName"
                size="3xl"
                class="ring-4 ring-violet-100"
              />
            </div>

            <div class="text-center space-y-2">
              <h3 class="text-xl font-semibold text-slate-900">{{ profile.fullName }}</h3>
              <p class="text-sm text-slate-600">{{ profile.email }}</p>
              <UBadge :color="getRoleColor(profile.role)" variant="soft" size="lg">
                {{ formatRole(profile.role) }}
              </UBadge>
            </div>

            <div class="space-y-3 pt-4 border-t border-slate-200">
              <div class="flex items-center gap-3 text-sm">
                <UIcon name="i-lucide-shield-check" class="h-4 w-4 text-slate-400" />
                <span class="text-slate-600">Staff Member</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <UIcon name="i-lucide-badge-check" class="h-4 w-4 text-slate-400" />
                <span class="text-slate-600">ID: {{ profile.id }}</span>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Settings Sections -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Account Information -->
        <UCard class="shadow-card">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <UIcon name="i-lucide-user" class="h-5 w-5" />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-slate-900">Account Information</h2>
                  <p class="text-sm text-slate-500">View your account details</p>
                </div>
              </div>
            </div>
          </template>

          <div v-if="profile" class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <label class="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Full Name
                </label>
                <p class="text-sm font-medium text-slate-900">{{ profile.fullName }}</p>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
                <p class="text-sm font-medium text-slate-900">{{ profile.email }}</p>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Role
                </label>
                <p class="text-sm font-medium text-slate-900">{{ formatRole(profile.role) }}</p>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Account ID
                </label>
                <p class="text-sm font-medium text-slate-900">#{{ profile.id }}</p>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-200">
              <UButton color="violet" variant="soft" disabled>
                <UIcon name="i-lucide-pencil" class="h-4 w-4" />
                Edit Profile (Coming Soon)
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Security Settings -->
        <UCard class="shadow-card">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <UIcon name="i-lucide-lock" class="h-5 w-5" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Security</h2>
                <p class="text-sm text-slate-500">Manage your security settings</p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <div class="rounded-lg border border-slate-200 p-4">
              <div class="flex items-start justify-between">
                <div class="space-y-1">
                  <h3 class="font-medium text-slate-900">Password</h3>
                  <p class="text-sm text-slate-500">Last changed 30 days ago</p>
                </div>
                <UButton color="gray" variant="ghost" size="sm" disabled>
                  Change
                </UButton>
              </div>
            </div>

            <div class="rounded-lg border border-slate-200 p-4">
              <div class="flex items-start justify-between">
                <div class="space-y-1">
                  <h3 class="font-medium text-slate-900">Two-Factor Authentication</h3>
                  <p class="text-sm text-slate-500">Add an extra layer of security</p>
                </div>
                <UButton color="gray" variant="ghost" size="sm" disabled>
                  Enable
                </UButton>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Preferences -->
        <UCard class="shadow-card">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <UIcon name="i-lucide-settings" class="h-5 w-5" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Preferences</h2>
                <p class="text-sm text-slate-500">Customize your experience</p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <div class="rounded-lg border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <h3 class="font-medium text-slate-900">Email Notifications</h3>
                  <p class="text-sm text-slate-500">Receive updates about appointments</p>
                </div>
                <UToggle disabled />
              </div>
            </div>

            <div class="rounded-lg border border-slate-200 p-4">
              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <h3 class="font-medium text-slate-900">Desktop Notifications</h3>
                  <p class="text-sm text-slate-500">Get notified in your browser</p>
                </div>
                <UToggle disabled />
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { fetcher } = useAdminApi();

useHead({
  title: "Profile Settings – Clinic Admin"
});

interface StaffProfile {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

const { data, pending: loading, error: fetchError, refresh } = await useAsyncData(
  "staff-profile",
  async () => {
    try {
      return await fetcher<StaffProfile>("/auth/profile");
    } catch (err: any) {
      throw new Error(err?.data?.message ?? err?.message ?? "Failed to load profile");
    }
  }
);

const profile = computed(() => data.value);
const error = computed(() => fetchError.value?.message);

function formatRole(role: string): string {
  return role
    .replace("ROLE_", "")
    .split("_")
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function getRoleColor(role: string): string {
  if (role.includes("ADMIN")) return "violet";
  if (role.includes("DOCTOR")) return "emerald";
  if (role.includes("RECEPTIONIST")) return "blue";
  return "gray";
}
</script>
