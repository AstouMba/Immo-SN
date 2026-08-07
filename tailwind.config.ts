import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        background: "#f5f0e8",
        foreground: "#171717",
        primary: {
          DEFAULT: "#171717",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#5e5a54",
          foreground: "#78715a",
        },
        card: {
          DEFAULT: "#fbf8f3",
          foreground: "#111111",
        },
        accent: {
          DEFAULT: "#8a8464",
          foreground: "#171717",
        },
        border: "rgba(0, 0, 0, 0.1)",
        beige: {
          50: "#fdfcfb",
          100: "#fbf8f3",
          200: "#f8f3ed",
          300: "#f5f0e8",
          400: "#e8dfd2",
        },
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(15, 23, 42, 0.18)",
        premium: "0 30px 80px -48px rgba(23, 23, 23, 0.4)",
        card: "0 24px 60px -42px rgba(23, 23, 23, 0.5)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.25rem",
        "5xl": "2.75rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;
