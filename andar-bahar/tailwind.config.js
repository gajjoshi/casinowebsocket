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
      keyframes: {
        glow: {
          '0%, 100%': { opacity: '0.50' }, // Start and end at 50% opacity
          '50%': { opacity: '0.1' }, // Middle of animation at 65% opacity
        },
      },
    },
    animation: {
      glow: 'glow 3s ease-in-out infinite', // 3 seconds, smooth, infinite
    },
  },
  plugins: [],
};
