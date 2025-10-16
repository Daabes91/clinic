<template>
  <div class="space-y-6 text-white">
    <header class="space-y-2 text-center">
      <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl">
        🦷
      </div>
      <h1 class="text-2xl font-semibold">Clinic Admin</h1>
      <p class="text-sm text-white/70">Sign in to manage bookings, staff, and reports.</p>
    </header>

    <UAlert
      v-if="errorMessage"
      color="red"
      variant="soft"
      :title="errorMessage"
    />

    <UForm :state="form" :schema="schema" @submit="onSubmit" class="space-y-4">
      <UFormGroup label="Email" name="email" required>
        <UInput
          v-model="form.email"
          type="email"
          placeholder="you@clinic.com"
          size="lg"
          :ui="inputUi"
        />
      </UFormGroup>

      <UFormGroup label="Password" name="password" required>
        <UInput
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          size="lg"
          :ui="inputUi"
        />
      </UFormGroup>

      <UFormGroup
        label="Two-factor code"
        name="twoFactorCode"
        help="Required if your account has 2FA enabled"
      >
        <UInput
          v-model="form.twoFactorCode"
          placeholder="123456"
          size="lg"
          :ui="inputUi"
        />
      </UFormGroup>

      <div class="flex items-center justify-end text-xs text-white/60">
        <NuxtLink to="#" class="hover:underline">Forgot password?</NuxtLink>
      </div>

      <UButton :loading="pending" type="submit" color="emerald" size="lg" class="w-full justify-center">
        Sign in
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import type { StaffLoginRequest } from "@/types/auth";

definePageMeta({
  layout: "auth"
});

const auth = useAuth();
const router = useRouter();
const route = useRoute();

const schema = object({
  email: string().required().email(),
  password: string().required().min(6),
  twoFactorCode: string().optional()
});

const form = reactive<StaffLoginRequest>({
  email: "",
  password: "",
  twoFactorCode: ""
});

const inputUi = {
  base: "text-slate-900 placeholder:text-slate-500",
  background: "bg-white",
  shadow: "shadow-none",
  ring: "ring-1 ring-transparent focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-emerald-200/40"
};

const pending = ref(false);
const errorMessage = ref<string | null>(null);

const onSubmit = async () => {
  pending.value = true;
  errorMessage.value = null;
  try {
    await auth.login({
      ...form,
      twoFactorCode: form.twoFactorCode ? form.twoFactorCode.trim() : undefined
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
