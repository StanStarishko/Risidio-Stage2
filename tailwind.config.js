/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/pages/api/**/*.{js,ts,jsx,tsx}",
    "./frontend/pages/report/**/*.{js,ts,jsx,tsx}",
    "./frontend/styles/**/*.css",
    "./frontend/utils/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}