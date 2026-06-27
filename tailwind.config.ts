import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--text-primary)",
        muted: "var(--text-secondary)",
        canvas: "var(--surface-page)",
        panel: "var(--surface-card)",
        line: "var(--border-subtle)",
        gd: {
          navy: "#183B70",
          dark: "#0F294F",
          cyan: "#22A9E0",
          mist: "#F6F9FC"
        },
        signatrain: {
          navy: "#153A66",
          dark: "#0B2442",
          teal: "#00A7B5",
          green: "#52B788",
          warm: "#F2B84B",
          mist: "#EEF8F8"
        }
      },
      boxShadow: {
        soft: "var(--shadow-card)"
      }
    }
  },
  plugins: []
};

export default config;
