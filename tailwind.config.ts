import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F4EEE3",
        oat: "#EDE3D2",
        surface: "#FFFCF6",
        espresso: {
          DEFAULT: "#2B1A11",
          soft: "#3E2A1C",
          muted: "#7A6354",
        },
        caramel: {
          DEFAULT: "#B86B2E",
          light: "#D9A066",
          dark: "#8E4E1E",
        },
        matcha: {
          DEFAULT: "#6E8C4E",
          light: "#9DB877",
        },
        clay: "#C97B5A",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(43,26,17,0.04), 0 18px 40px -24px rgba(43,26,17,0.35)",
        lift: "0 30px 60px -28px rgba(43,26,17,0.45)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.6)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      keyframes: {
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(900%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "rise": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "scan-line": "scan-line 2s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.6s ease-out infinite",
        "rise": "rise 0.5s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
