/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      colors: {
        cream:  { DEFAULT:'#F7F6F2', 100:'#F7F6F2', 200:'#EFEDE7' },
        sage:   { DEFAULT:'#2E7D6B', light:'#A7C4A0', dark:'#1E5E52', soft:'#3D9B85' },
      },
    },
  },
  plugins: [],
}
