import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: "#eef6ff",
          100: "#d9ecff",
          200: "#b8dbff",
          300: "#88c2ff",
          400: "#4d9dff",
          500: "#1c7bff",
          600: "#0c5fe0",
          700: "#0747ad",
          800: "#063b8a",
          900: "#072f6b",
          950: "#04163a",
        },
        surface: {
          50: "#f5f6fb",
          100: "#e7eaf5",
          200: "#c9cde1",
          300: "#a6abc7",
          400: "#888dad",
          500: "#6e7394",
          600: "#565b78",
          700: "#40435b",
          800: "#2b2e40",
          900: "#191c28",
          950: "#0b0d13",
        },
        accent: "#5cf0d3",
        success: "#22c55e",
        warning: "#fbbf24",
      },
      boxShadow: {
        floating: "0 20px 60px rgba(8, 15, 40, 0.45)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
