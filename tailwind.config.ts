import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        // Custom colors
        brand: {
          light: "#FFE5D9",
          DEFAULT: "#FFCAD4",
          dark: "#F4ACB7",
        },
        accent: "#9D8189",
        success: "#4CAF50",
        warning: "#FFC107",
        error: "#F44336",
        pastelBlue: "#4A6FA5",
        // New custom colors
        custom: {
          purple: {
            light: "#E6E6FA",
            DEFAULT: "#9370DB",
            dark: "#483D8B",
          },
          teal: {
            light: "#E0F2F1",
            DEFAULT: "#009688",
            dark: "#004D40",
          },
          coral: {
            light: "#FFE4E1",
            DEFAULT: "#FF7F50",
            dark: "#CD5B45",
          },
          mint: {
            light: "#F5FFFA",
            DEFAULT: "#98FB98",
            dark: "#90EE90",
          },
          slate: {
            light: "#F8FAFC",
            DEFAULT: "#64748B",
            dark: "#1E293B",
          },
        },
        parties: {
          conservative: "#142f52",
          Liberal: "#d41f27",
          NDP: "#f58220",
          Green: "#20a242",
          Bloc: "#51a5e1",
        },
      },
    },
  },
  plugins: [],
};

export default config;
