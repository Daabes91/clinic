import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui-kit/src/**/*.{ts,tsx}"],
  theme: {
    extend: {}
  },
  darkMode: ["class"],
  plugins: []
};

export default config;
