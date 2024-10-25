/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brown: {
          700: "#5C4033", // Adjust to match the brown shade in your design
        },
      },
      fontFamily: {
        questrial: ["Questrial", "sans-serif"],
        ramaraja: ["Ramaraja", "serif"],
      },
    },
  },
  plugins: [],
};
