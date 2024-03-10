/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily : {
        'poppins' : ['Poppins'],
        'oswald' : ['Oswald'],
        'bebas' : ['Bebas Neue'],
        'lexend' : ['Lexend'],

      },
      backgroundImage: theme => ({
        'blueCircle' : "url('./assets/decoration/blue.png')",
        'orangeCircle' : "url('./assets/decoration/orange.png')",
      })
    },
  },
  plugins: [],
}