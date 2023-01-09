/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#0074B3",
          dark: "#003049",
        },
        priority: { high: "#0074B3", medium: "#F77F00", low: "#BBB592" },
        error: "#FB2834",
      },
    },
  },
  plugins: [],
};
