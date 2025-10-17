export default defineAppConfig({
  ui: {
    strategy: "override",
    primary: "violet",
    gray: "slate",
    formGroup: {
      label: {
        wrapper: "flex content-center items-center justify-between",
        base: "block font-semibold text-gray-900 dark:text-black-100",
        required: "after:content-['*'] after:ms-0.5 after:text-red-500 dark:after:text-red-400"
      },
      description: "text-slate-500 dark:text-slate-300",
      hint: "text-slate-500 dark:text-slate-300",
      help: "mt-2 text-slate-500 dark:text-slate-300",
      error: "mt-2 text-red-600 dark:text-red-400",
      default: {
        size: "sm"
      }
    },
    button: {
      rounded: "rounded-lg",
      base: "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
      size: {
        xs: "h-8 px-3 text-xs",
        sm: "h-9 px-3.5 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-base"
      },
      variant: {
        solid: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md active:scale-[0.98]",
        ghost: "border border-transparent text-primary-600 hover:bg-primary-50/80 active:bg-primary-100",
        outline: "border border-slate-300 bg-white text-slate-700 hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50/30 shadow-sm",
        soft: "bg-primary-50 text-primary-700 hover:bg-primary-100 active:bg-primary-200"
      }
    },
    input: {
      rounded: "rounded-lg",
      base: "block w-full text-sm text-slate-900 transition-all duration-200 bg-white border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed",
      size: {
        sm: "h-9 pl-10 pr-3 text-sm",
        md: "h-10 pl-10 pr-3.5 text-sm",
        lg: "h-11 pl-12 pr-4 text-base"
      }
    },
    textarea: {
      rounded: "rounded-lg",
      base: "block w-full text-sm text-slate-900 transition-all duration-200 bg-white border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed",
      size: {
        sm: "px-3 py-2 text-sm",
        md: "px-3.5 py-2.5 text-sm",
        lg: "px-4 py-3 text-base"
      }
    },
    card: {
      rounded: "rounded-xl",
      shadow: "shadow-sm border border-slate-200/60",
      base: "bg-white overflow-hidden",
      header: {
        base: "px-6 py-4 border-b border-slate-200/60 bg-slate-50/30"
      },
      body: {
        base: "px-6 py-5"
      }
    },
    table: {
      rounded: "rounded-lg",
      divide: "divide-slate-100",
      th: {
        base: "text-xs font-semibold uppercase tracking-wide text-slate-700 bg-slate-50",
        padding: "px-4 py-3.5"
      },
      td: {
        base: "text-sm text-slate-700",
        padding: "px-4 py-4"
      },
      tr: {
        base: "hover:bg-slate-50/60 transition-colors duration-150"
      }
    },
    dropdown: {
      rounded: "rounded-lg",
      shadow: "shadow-lg border border-slate-200/80",
      background: "bg-white"
    },
    selectMenu: {
      rounded: "rounded-lg",
      trigger: "h-10 pr-10 pl-3.5 text-sm bg-white border border-slate-300 text-slate-900 transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200",
      icon: {
        trailing: {
          wrapper: "absolute inset-y-0 end-3 flex items-center text-slate-400"
        }
      },
      option: {
        base: "px-3.5 py-2.5 text-sm transition-colors duration-150",
        active: "bg-primary-50 text-primary-700",
        selected: "bg-primary-100 text-primary-800 font-medium"
      }
    },
    badge: {
      rounded: "rounded-md",
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs font-medium"
      }
    },
    avatar: {
      rounded: "rounded-lg"
    },
    notifications: {
      wrapper: "fixed inset-0 flex flex-col items-end justify-start z-[100] pointer-events-none",
      position: "top-0 end-0",
      width: "w-full sm:w-[420px]",
      container: "p-4 sm:p-6 space-y-4 overflow-y-auto pointer-events-auto max-h-screen"
    },
    notification: {
      wrapper: "w-full pointer-events-auto transform transition-all duration-300 ease-out animate-in slide-in-from-right-full fade-in",
      container: "relative overflow-hidden",
      inner: "w-full flex gap-4 items-start",
      background: "bg-white dark:bg-slate-900 backdrop-blur-xl",
      shadow: "shadow-2xl shadow-slate-900/20 dark:shadow-black/60",
      rounded: "rounded-2xl",
      padding: "p-5",
      gap: "gap-4",
      ring: "ring-1 ring-slate-200/60 dark:ring-slate-800",
      title: "text-sm font-bold text-slate-900 dark:text-white leading-snug",
      description: "mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300",
      icon: {
        base: "flex-shrink-0 w-5 h-5",
        color: {
          red: "text-red-600 dark:text-red-500",
          green: "text-green-600 dark:text-green-500",
          blue: "text-blue-600 dark:text-blue-500",
          amber: "text-amber-600 dark:text-amber-500",
          violet: "text-violet-600 dark:text-violet-500",
          gray: "text-slate-600 dark:text-slate-400"
        }
      },
      progress: {
        base: "absolute bottom-0 start-0 end-0 h-1.5",
        background: "bg-gradient-to-r from-violet-500 via-violet-600 to-violet-500 dark:from-violet-400 dark:via-violet-500 dark:to-violet-400"
      },
      default: {
        color: "violet",
        timeout: 5000,
        closeButton: {
          icon: "i-lucide-x",
          color: "gray",
          variant: "ghost",
          size: "sm",
          class: "!p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors",
          padded: false
        },
        actionButton: {
          size: "sm",
          color: "violet",
          variant: "soft",
          class: "mt-3"
        }
      }
    }
  }
});
