export default defineAppConfig({
  ui: {
    strategy: "override",
    primary: "violet",
    gray: "slate",
    button: {
      rounded: "rounded-xl",
      base: "inline-flex items-center justify-center gap-2 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed",
      size: {
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-5 text-sm"
      },
      variant: {
        solid: "bg-primary-500 text-white hover:bg-primary-600",
        ghost: "border border-transparent text-primary-600 hover:bg-primary-50",
        outline: "border border-slate-200 text-slate-700 hover:border-primary-200 hover:text-primary-600",
        soft: "bg-primary-50 text-primary-600 hover:bg-primary-100"
      }
    },
    input: {
      rounded: "rounded-xl",
      base: "block w-full text-sm transition bg-white border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed",
      size: {
        md: "h-11 px-3",
        lg: "h-12 px-4"
      }
    },
    textarea: {
      rounded: "rounded-xl",
      base: "block w-full text-sm transition bg-white border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 placeholder:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed",
      size: {
        md: "px-4 py-3"
      }
    },
    card: {
      rounded: "rounded-2xl",
      shadow: "shadow-[0_15px_45px_-25px_rgba(15,23,42,0.35)]",
      base: "bg-white border border-slate-200"
    },
    table: {
      rounded: "rounded-2xl",
      divide: "divide-slate-100",
      th: "text-xs font-semibold uppercase tracking-wide text-slate-500",
      td: "text-sm text-slate-600",
      tr: {
        base: "hover:bg-slate-50/80 transition"
      }
    },
    dropdown: {
      rounded: "rounded-xl",
      shadow: "shadow-xl",
      background: "bg-white border border-slate-200"
    },
    selectMenu: {
      rounded: "rounded-xl",
      trigger: "h-11 px-3 text-sm bg-white border border-slate-200 text-slate-700 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200",
      option: {
        base: "px-3 py-2 text-sm",
        active: "bg-primary-50 text-primary-700",
        selected: "bg-primary-100 text-primary-700"
      }
    },
    radio: {
      base: "h-5 w-5 text-primary-500 focus:ring-primary-200"
    },
    badge: {
      rounded: "rounded-full",
      size: {
        md: "px-3 py-1 text-xs font-medium"
      }
    }
  }
});
