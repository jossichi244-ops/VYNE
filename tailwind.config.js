/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          purple: "#a855f7",
          cyan: "#22d3ee",
          pink: "#ec4899",
        },
      },
      boxShadow: {
        neon: "0 0 10px rgba(168, 85, 247, 0.8)",
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;
