/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/index.{tsx,jsx,ts,js}",
    "./src/App.{tsx,jsx,ts,js}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{tsx,jsx,ts,js}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#995F41",
        secondary: "#95B25F",
        third: "#FF7839",
        "primary-dark": "#4B3122",
        "bg-light": "#F5F1EE",
        "modal-bg": "rgba(153, 95, 65, 0.75)", // rgba version of your primary color with 75% opacity
      },
      fontSize: {
        h1: "32px",
        h2: "28px",
        h3: "24px",
        h4: "20px",
        p: "16px", // Default paragraph text size
        small: "14px", // For smaller text
        xs: "12px", // Extra small text size
      },
    },
  },
  plugins: [],
};
