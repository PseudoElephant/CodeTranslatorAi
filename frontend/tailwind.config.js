/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
const { toRadixVars } = require("windy-radix-palette/vars");

module.exports = {
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/common/**/*.{ts,tsx}",
    "./src/modules/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
        code: ["Fira Code"],
      },
      colors: {
        primary: toRadixVars("indigo"),
        neutral: toRadixVars("slate"),
        error: toRadixVars("tomato"),
        success: toRadixVars("green"),
        warning: toRadixVars("amber"),
      },
    },
  },
  /* Comment out to stop using systems theme */
  darkMode: "class",
  /* Info on plugin: https://windy-radix-palette.vercel.app/docs/palette/aliasing */
  plugins: [require("windy-radix-palette")],
};
