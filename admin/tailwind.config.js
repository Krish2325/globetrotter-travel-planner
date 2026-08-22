/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      colors: {
        cream:  { DEFAULT:'#F5F5FC', 100:'#F5F5FC', 200:'#ECECF7' },
        sage:   { DEFAULT:'#4F46E5', light:'#A5B4FC', dark:'#3730A3', soft:'#6366F1' },
      },
    },
  },
  plugins: [],
}
