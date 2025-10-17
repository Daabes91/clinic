<template>
  <div class="flex min-h-screen">
    <!-- Left Panel - Branding -->
    <div class="hidden w-1/2 bg-gradient-to-br from-violet-600 via-violet-700 to-violet-800 lg:flex lg:flex-col lg:justify-between p-12">
      <div>
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm text-2xl">
            🦷
          </div>
          <div class="text-white">
            <p class="text-sm font-medium opacity-90">Welcome to</p>
            <p class="text-xl font-bold">Clinic Admin</p>
          </div>
        </div>
      </div>
      
      <div class="space-y-8">
        <div class="space-y-4">
          <h1 class="text-4xl font-bold leading-tight text-white">
            Manage your clinic<br />with confidence
          </h1>
          <p class="text-lg text-violet-100">
            Streamline appointments, track patients, and grow your practice all in one place.
          </p>
        </div>
        
        <div class="grid gap-4">
          <div class="flex items-start gap-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <UIcon name="i-lucide-calendar-check" class="h-6 w-6 text-violet-200 mt-0.5" />
            <div class="text-white">
              <p class="font-semibold">Smart Scheduling</p>
              <p class="text-sm text-violet-100">Automated appointment management</p>
            </div>
          </div>
          <div class="flex items-start gap-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <UIcon name="i-lucide-users" class="h-6 w-6 text-violet-200 mt-0.5" />
            <div class="text-white">
              <p class="font-semibold">Patient Records</p>
              <p class="text-sm text-violet-100">Centralized patient database</p>
            </div>
          </div>
          <div class="flex items-start gap-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
            <UIcon name="i-lucide-bar-chart-3" class="h-6 w-6 text-violet-200 mt-0.5" />
            <div class="text-white">
              <p class="font-semibold">Analytics</p>
              <p class="text-sm text-violet-100">Real-time performance insights</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 text-sm text-violet-200">
        <a href="#" class="hover:text-white transition-colors">Privacy</a>
        <span>•</span>
        <a href="#" class="hover:text-white transition-colors">Terms</a>
        <span>•</span>
        <a href="#" class="hover:text-white transition-colors">Support</a>
      </div>
    </div>
    
    <!-- Right Panel - Login Form -->
    <div class="flex w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-8 lg:w-1/2">
      <div class="w-full max-w-md space-y-8">
        <!-- Mobile Header -->
        <div class="text-center lg:hidden">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 text-3xl shadow-lg">
            🦷
          </div>
          <h1 class="mt-4 text-2xl font-bold text-black">Clinic Admin</h1>
          <p class="mt-2 text-sm text-slate-600">Sign in to your account</p>
        </div>
        
        <div class="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
          <div class="space-y-6">
            <div class="hidden lg:block">
              <h2 class="text-2xl font-bold text-black">Welcome back</h2>
              <p class="mt-2 text-sm text-slate-600">
                Enter your credentials to access your dashboard
              </p>
            </div>

            <UAlert
              v-if="errorMessage !== null"
              color="red"
              variant="soft"
              icon="i-lucide-alert-circle"
              :title="errorMessage"
              class="animate-shake"
            />

            <UForm :state="form" :schema="schema" @submit="onSubmit" class="space-y-5">
              <UFormGroup label="Email Address" name="email" required>
                <div class="relative">
                  <input 
                    id="v-1" 
                    name="email" 
                    type="email" 
                    placeholder="you@clinic.com" 
                    class="block w-full transition-all duration-200 border border-slate-300 focus:border-primary-500 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed form-input rounded-lg placeholder-gray-400 h-11 text-base py-2.5 shadow-sm bg-white text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-500 pl-16 pr-3.5" 
                    v-model="form.email"
                  />
                  <span class="absolute inset-y-0 start-0 flex items-center pointer-events-none px-3.5 rounded-s-lg bg-gradient-to-br from-violet-600/15 to-violet-500/15">
                  <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-inner">
                    <UIcon name="i-lucide-mail" class="h-4 w-4 text-violet-600" aria-hidden="true" />
                  </span>
                  </span>
                </div>
              </UFormGroup>

              <UFormGroup label="Password" name="password" required>
              <div class="relative">
                <input
                  id="v-2"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  class="block w-full transition-all duration-200 border border-slate-300 focus:border-primary-500 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed form-input rounded-lg placeholder-gray-400 h-11 text-base py-2.5 shadow-sm bg-white text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-500 pl-16 pr-3.5"
                  v-model="form.password"
                />
                <span class="absolute inset-y-0 start-0 flex items-center pointer-events-none px-3.5 rounded-s-lg bg-gradient-to-br from-violet-600/15 to-violet-500/15">
                  <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-inner">
                    <UIcon name="i-lucide-lock" class="h-4 w-4 text-violet-600" aria-hidden="true" />
                  </span>
                </span>
                <UButton
                  type="button"
                  variant="ghost"
                  size="xs"
                  class="absolute inset-y-1 end-2 flex items-center"
                  @click.prevent="showPassword = !showPassword"
                >
                  <span
                    class="iconify flex-shrink-0 h-4 w-4"
                    :class="showPassword ? 'i-lucide:eye-off' : 'i-lucide:eye'"
                    aria-hidden="true"
                  ></span>
                </UButton>
              </div>
              </UFormGroup>

              <div class="flex items-center justify-between text-sm">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" class="rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                  <span class="text-slate-700">Remember me</span>
                </label>
                <NuxtLink to="#" class="font-medium text-violet-600 hover:text-violet-700 transition-colors">
                  Forgot password?
                </NuxtLink>
              </div>

              <UButton 
                :loading="pending" 
                type="submit" 
                color="violet" 
                size="lg" 
                block
                class="justify-center shadow-md hover:shadow-lg"
              >
                <template #leading>
                  <UIcon name="i-lucide-log-in" class="h-5 w-5" />
                </template>
                Sign In
              </UButton>
            </UForm>
          </div>
        </div>
        
        <p class="text-center text-sm text-slate-600">
          Need access? 
          <a href="#" class="font-medium text-violet-600 hover:text-violet-700 transition-colors">
            Contact your administrator
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import type { StaffLoginRequest } from "@/types/auth";

definePageMeta({
  layout: false
});

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const schema = object({
  email: string().required().email(),
  password: string().required().min(6)
});

const form = reactive<StaffLoginRequest>({
  email: "",
  password: ""
});

const pending = ref(false);
const errorMessage = ref<string | null>(null);
const showPassword = ref(false);

const onSubmit = async () => {
  pending.value = true;
  errorMessage.value = null;
  try {
    await auth.login({
      ...form
    });
    const redirect = Array.isArray(route.query.redirect)
      ? route.query.redirect[0]
      : route.query.redirect;
    await router.push(redirect && redirect !== "/login" ? redirect : "/");
  } catch (error) {
    errorMessage.value = (error as Error).message;
  } finally {
    pending.value = false;
  }
};
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
