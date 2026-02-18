import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // HeroUI: include theme dist files so tailwind can generate all component classes.
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",

    // pnpm installs packages under node_modules/.pnpm, so we must include that path too.
    "./node_modules/.pnpm/**/node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
};

export default config;
