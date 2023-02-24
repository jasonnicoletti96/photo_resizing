/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'black':'black',
      'darkGrey': '#181818',
      'grey': '#242424',
      'red': '#D9230F',
      'white':'white',
      'lightGrey':'#e5e5e5'
    },
    extend: {},
  },
  plugins: [
    require("daisyui"),
    require('tailwind-scrollbar')
  ],
  
  variants: {
    scrollbar: ['rounded']
}
}