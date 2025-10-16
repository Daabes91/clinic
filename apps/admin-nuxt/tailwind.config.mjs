import colors from "tailwindcss/colors.js";
import forms from "@tailwindcss/forms";

const palette = {
  transparent: "transparent",
  current: "currentColor",
  white: "#ffffff",
  black: "#000000",
  slate: colors.slate,
  gray: colors.gray,
  zinc: colors.zinc,
  neutral: colors.neutral,
  stone: colors.stone,
  red: colors.red,
  orange: colors.orange,
  amber: colors.amber,
  yellow: colors.yellow,
  lime: colors.lime,
  green: colors.green,
  emerald: colors.emerald,
  teal: colors.teal,
  cyan: colors.cyan,
  sky: colors.sky,
  blue: colors.blue,
  indigo: colors.indigo,
  violet: colors.violet,
  purple: colors.purple,
  fuchsia: colors.fuchsia,
  pink: colors.pink,
  rose: colors.rose
};

palette.cool = palette.gray;
palette.primary = palette.emerald;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue"
  ],
  theme: {
    colors: palette,
    extend: {
      fontFamily: {
        sans: ["'Inter'", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        card: "0 35px 120px -45px rgba(15, 23, 42, 0.35)"
      },
      borderRadius: {
        lg: "1.25rem"
      }
    }
  },
  plugins: [forms]
};
