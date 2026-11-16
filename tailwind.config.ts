import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d9efff",
          200: "#bce2ff",
          300: "#8eccff",
          400: "#59aeff",
          500: "#2f8cff",
          600: "#176df5",
          700: "#1054e1",
          800: "#1444b6",
          900: "#163c8f",
          950: "#0c1730"
        },
        slate: {
          850: "#151f30",
          900: "#0b1220",
          950: "#060a12"
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
