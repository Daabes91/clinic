<template>
  <UApp>
    <NuxtLoadingIndicator color="#6d28d9" />
    <NuxtLayout>
      <NuxtPage :page-key="route => route.fullPath" />
    </NuxtLayout>
    <ClientOnly>
      <UNotifications />
    </ClientOnly>
  </UApp>
</template>
