const tailwindColors = require("./node_modules/tailwindcss/colors");
const colorSafeList = [];
const borderSafeList = [
  "border-health_check-in",
  "border-event",
  "border-health",
  "border-community",
  "border-milestones",
];
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
        colorSafeList.push(`border-${colorName}-${shade}`); // Add border color classes
      }
    });
  }
}

const fonts = {
  light: "Quicksand_300Light",
  regular: "Quicksand_400Regular",
  medium: "Quicksand_500Medium",
  semibold: "Quicksand_600SemiBold",
  bold: "Quicksand_700Bold",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [...colorSafeList, ...borderSafeList], // Safelist all color-related classes
  theme: {
    extend: {
      fontFamily: {
        light: fonts.light,
        main: fonts.regular,
        medium: fonts.medium,
        semibold: fonts.semibold,
        fwbold: fonts.bold,
      },
      borderColor: {
        "health_check-in": "#4da2f4",
        event: "#b85adf", // Added border class for event
        health: "#4da2f4",
        community: "#FDCBF4",
        milestones: "#F6D95D",
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
          600: "#0D96FF",
          700: "#067FF3",
        },
        ring: "#bb5adf",
        "health_check-in": "#4da2f4",
        event: "#b85adf", // Added border class for event
        health: "#4da2f4",
        community: "#FDCBF4",
        milestones: "#F6D95D",
        danger: "#F87171",
      },
    },
  },
  plugins: [],
};
