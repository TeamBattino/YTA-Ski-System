import {heroui} from '@heroui/theme';
import {nextui} from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(dropdown|menu|divider|popover|button|ripple|spinner).js"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui(),heroui()]}

export default config;
