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
        ink: "#17202a",
        muted: "#5f6b78",
        canvas: "#f6f4ef",
        panel: "#ffffff",
        line: "#d9dee5",
        gd: {
          navy: "#10243f",
          teal: "#2d8c89",
          mist: "#e7f3f2"
        },
        signatrain: {
          charcoal: "#222426",
          gold: "#b88a2a",
          hay: "#f6ecd7"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(23, 32, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
