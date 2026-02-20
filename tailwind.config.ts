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
        navy: {
          50:  "#f0f4f9",
          100: "#d6e0ed",
          200: "#b3c6dc",
          300: "#85a5c4",
          400: "#5680a8",
          600: "#25527f",
          700: "#1e4570",
          800: "#1e3a5f",  // primary brand navy
          900: "#152a45",  // darker – used for sidebar
          950: "#0e1e30",
        },
      },
    },
  },
  plugins: [],
};
export default config;
