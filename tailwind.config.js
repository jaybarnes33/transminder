/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        main: "Quicksand",
      },
      colors: {
        rose: {
          50: "#FEF1FB",
          100: "#FEE5F9",
          200: "#FFB7F1",
          300: "#FFA1EB",
          400: "#FF66DB",
          500: "#FB39C7",
          600: "#EB17A7",
          700: "#CD0989",
          800: "#A90B71",
          900: "#8D0E5F",
        },
        dark: "#020202",
        azure: {
          50: "#EDFAFF",
          100: "#D7F3FF",
          200: "#B7ECFF",
          300: "#86E2FF",
          400: "#4DCFFF",
          500: "#24B2FF",
          600: "#0D96FF",
          700: "#067FF3",
          800: "#0C63C1",
          900: "#115597",
        },
        ring: "#bb5adf",
      },
    },
  },
  plugins: [],
};
