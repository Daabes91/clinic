/**
 * Enhanced toast notifications with icons and better messaging
 */
export const useEnhancedToast = () => {
  const toast = useToast();

  return {
    // Success notifications
    success: (options: { title: string; description?: string }) => {
      toast.add({
        title: options.title,
        description: options.description,
        color: "green",
        icon: "i-lucide-check-circle-2",
        timeout: 5000,
        ui: {
          wrapper: "notification-wrapper notification-success",
          icon: { base: "flex-shrink-0 w-6 h-6" }
        }
      });
    },

    // Error notifications
    error: (options: { title: string; description?: string; error?: any }) => {
      const description =
        options.description ||
        options.error?.data?.message ||
        options.error?.message ||
        "An unexpected error occurred. Please try again.";

      toast.add({
        title: options.title,
        description,
        color: "red",
        icon: "i-lucide-alert-circle",
        timeout: 5000,
        ui: {
          wrapper: "notification-wrapper notification-error",
          icon: { base: "flex-shrink-0 w-6 h-6" }
        }
      });
    },

    // Warning notifications
    warning: (options: { title: string; description?: string }) => {
      toast.add({
        title: options.title,
        description: options.description,
        color: "amber",
        icon: "i-lucide-alert-triangle",
        timeout: 5000,
        ui: {
          wrapper: "notification-wrapper notification-warning",
          icon: { base: "flex-shrink-0 w-6 h-6" }
        }
      });
    },

    // Info notifications
    info: (options: { title: string; description?: string }) => {
      toast.add({
        title: options.title,
        description: options.description,
        color: "blue",
        icon: "i-lucide-info",
        timeout: 5000,
        ui: {
          wrapper: "notification-wrapper notification-info",
          icon: { base: "flex-shrink-0 w-6 h-6" }
        }
      });
    },

    // Loading notifications (manual close)
    loading: (options: { title: string; description?: string }) => {
      return toast.add({
        title: options.title,
        description: options.description,
        color: "gray",
        icon: "i-lucide-loader-2",
        timeout: 0, // Manual close
        ui: {
          wrapper: "notification-wrapper",
          icon: { base: "flex-shrink-0 w-6 h-6 animate-spin" }
        }
      });
    },

    // Specific action toasts
    created: (entityName: string) => {
      toast.add({
        title: `${entityName} created successfully`,
        description: `The ${entityName.toLowerCase()} has been added to the system.`,
        color: "green",
        icon: "i-lucide-check-circle-2",
        timeout: 5000,
        ui: {
          wrapper: "notification-wrapper notification-success",
          icon: { base: "flex-shrink-0 w-6 h-6" }
        }
      });
    },

    updated: (entityName: string) => {
      toast.add({
        title: `${entityName} updated successfully`,
        description: `Your changes have been saved.`,
        color: "green",
        icon: "i-lucide-check-circle-2",
        timeout: 5000,
        ui: {
          wrapper: "notification-wrapper notification-success",
          icon: { base: "flex-shrink-0 w-6 h-6" }
        }
      });
    },

    deleted: (entityName: string) => {
      toast.add({
        title: `${entityName} deleted successfully`,
        description: `The ${entityName.toLowerCase()} has been removed from the system.`,
        color: "green",
        icon: "i-lucide-trash-2",
        timeout: 5000,
        ui: {
          wrapper: "notification-wrapper notification-success",
          icon: { base: "flex-shrink-0 w-6 h-6" }
        }
      });
    },

    saved: () => {
      toast.add({
        title: "Changes saved",
        description: "Your updates have been successfully applied.",
        color: "green",
        icon: "i-lucide-save",
        timeout: 5000,
        ui: {
          wrapper: "notification-wrapper notification-success",
          icon: { base: "flex-shrink-0 w-6 h-6" }
        }
      });
    },

    cancelled: () => {
      toast.add({
        title: "Action cancelled",
        description: "No changes were made.",
        color: "gray",
        icon: "i-lucide-x-circle",
        timeout: 5000,
        ui: {
          wrapper: "notification-wrapper",
          icon: { base: "flex-shrink-0 w-6 h-6" }
        }
      });
    },

    comingSoon: (feature: string) => {
      toast.add({
        title: "Coming soon",
        description: `${feature} will be available in the next update.`,
        color: "blue",
        icon: "i-lucide-sparkles",
        timeout: 5000,
        ui: {
          wrapper: "notification-wrapper notification-info",
          icon: { base: "flex-shrink-0 w-6 h-6" }
        }
      });
    }
  };
};
