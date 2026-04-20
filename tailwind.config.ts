import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#112218",
        moss: "#243f2f",
        leaf: "#3f6f50",
        sand: "#efe6d4",
        ember: "#d97242",
        mist: "#f6f2e8"
      },
      boxShadow: {
        panel: "0 20px 60px rgba(17, 34, 24, 0.12)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(17,34,24,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(17,34,24,0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

export default config;
