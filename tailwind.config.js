const tailwindColors = require("./node_modules/tailwindcss/colors");
const colorSafeList = [];

// Skip these to avoid a load of deprecated warnings when tailwind starts up
const deprecated = [
  "lightBlue",
  "warmGray",
  "trueGray",
  "coolGray",
  "blueGray",
];

for (const colorName in tailwindColors) {
  if (deprecated.includes(colorName)) {
    continue;
  }

  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  const pallette = tailwindColors[colorName];

  if (typeof pallette === "object") {
    shades.forEach((shade) => {
      if (shade in pallette) {
        colorSafeList.push(`text-${colorName}-${shade}`);
        colorSafeList.push(`bg-${colorName}-${shade}`);
      }
    });
  }
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  safelist: colorSafeList,
  theme: {
    extend: {
      fontFamily: {
        main: "Quicksand",
      },
      colors: {
        purple: {
          500: "#b85adf",
        },
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
        blue: {
          500: "#24B2FF",
        },
        ring: "#bb5adf",
      },
    },
  },
  plugins: [],
};
