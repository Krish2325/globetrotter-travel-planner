/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body:    ['Manrope', 'sans-serif'],
      },
      colors: {
        cream:  { DEFAULT:'#F7F6F2', 100:'#F7F6F2', 200:'#EFEDE7' },
        sage:   { DEFAULT:'#F2683A', light:'#FFC9A3', dark:'#B33E1A', soft:'#FB8A4C' },
      },
    },
  },
  plugins: [],
}
