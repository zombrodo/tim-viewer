/** @type {import('tailwindcss').Config} */

const burnt = {
  50: "#f5ede1",
  100: "#ebd1ac",
  200: "#e0b271",
  300: "#d59435",
  400: "#ce8000",
  500: "#c66c00",
  600: "#c36100",
  700: "#be5300",
  800: "#b74300",
  900: "#ae2500",
};

const orangered = {
  50: "#ffeaec",
  100: "#fecbce",
  200: "#ec9794",
  300: "#e1706a",
  400: "#e95045",
  500: "#ec4028",
  600: "#de3628",
  700: "#cc2c23",
  800: "#bf251c",
  900: "#b0190f",
};

export default {
  content: ["src/**/*.{ts,tsx}", "index.html"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        orangered,
        burnt,
      },
      fontFamily: {
        sans: "Inter",
      },
    },
  },
  plugins: [],
};
