/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal:    '#0A9396',
          tealL:   '#94D2BD',
          navy:    '#0D1B2A',
          amber:   '#E9C46A',
          coral:   '#E76F51',
          green:   '#2DC653',
          purple:  '#7B2FBE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
