import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui-kit/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9e9ff",
          200: "#bad7ff",
          300: "#8ebcff",
          400: "#5c9bff",
          500: "#377dff",
          600: "#1f60eb",
          700: "#154acc",
          800: "#123aa3",
          900: "#112f7f"
        }
      },
      boxShadow: {
        card: "0 20px 45px -20px rgba(15, 23, 42, 0.25)"
      }
    }
  },
  darkMode: ["class"],
  plugins: []
};

export default config;
