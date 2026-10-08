import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // Theme-aware (see app/globals.css): these flip between dark and
        // light. The names predate theming; dark-* are surfaces, sky-* text.
        dark: {
          1: "rgb(var(--c-dark-1) / <alpha-value>)",
          2: "rgb(var(--c-dark-2) / <alpha-value>)",
          3: "rgb(var(--c-dark-3) / <alpha-value>)",
          4: "rgb(var(--c-dark-4) / <alpha-value>)",
        },
        fg: "rgb(var(--c-fg) / <alpha-value>)",
        "warn-text": "rgb(var(--c-warn-text) / <alpha-value>)",
        "danger-text": "rgb(var(--c-danger-text) / <alpha-value>)",
        shade: "rgb(var(--c-shadow) / <alpha-value>)",
        blue: {
          1: "#0E78F9",
        },
        sky: {
          1: "rgb(var(--c-sky-1) / <alpha-value>)",
          2: "rgb(var(--c-sky-2) / <alpha-value>)",
          3: "rgb(var(--c-sky-3) / <alpha-value>)",
        },
        orange: {
          1: "#FF742E",
        },
        purple: {
          1: "#830EF9",
        },
        yellow: {
          1: "#F9A90E",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        // A reaction emoji rising off a participant's tile.
        "float-up": {
          "0%": { opacity: "0", transform: "translateY(0) scale(0.6)" },
          "12%": { opacity: "1", transform: "translateY(-12px) scale(1.15)" },
          "100%": { opacity: "0", transform: "translateY(-180px) scale(1)" },
        },
        // The reduced-motion version: appear, hold, fade.
        "fade-hold": {
          "0%, 70%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        // A soft pulse around whoever is speaking. Inset: tiles clip their overflow.
        "speaking-glow": {
          "0%, 100%": { boxShadow: "inset 0 0 0 3px #0E78F9, inset 0 0 18px rgba(14,120,249,0.35)" },
          "50%": { boxShadow: "inset 0 0 0 3px #0E78F9, inset 0 0 34px rgba(14,120,249,0.6)" },
        },
        // A participant tile popping into the call grid.
        join: {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        join: "join 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "float-up": "float-up 2.6s cubic-bezier(0.2, 0.7, 0.2, 1) forwards",
        "fade-hold": "fade-hold 2.6s ease-out forwards",
        "speaking-glow": "speaking-glow 1.6s ease-in-out infinite",
      },
      backgroundImage: {
        hero: "url('/images/hero-background.png')",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;
