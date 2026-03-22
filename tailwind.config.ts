import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        qud: {
          bg:           "#060606",
          surface:      "#0F0F0F",
          raised:       "#161616",
          border:       "#1F1F1F",
          accent:       "#C8102E",
          "accent-dim": "#8B0B1F",
          text:         "#E8E8E8",
          muted:        "#666666",
          faint:        "#333333",
        },
      },
      fontFamily: {
        bebas:   ["var(--font-bebas)", "sans-serif"],
        barlow:  ["var(--font-barlow)", "sans-serif"],
        inter:   ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0",
        none:    "0",
        sm:      "0",
        md:      "0",
        lg:      "0",
        xl:      "0",
        "2xl":   "0",
        "3xl":   "0",
        full:    "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
