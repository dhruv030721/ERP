/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins"],
        oswald: ["Oswald"],
        bebas: ["Bebas Neue"],
        lexend: ["Lexend"],
        DmSans: ["DM Sans"]
      },
      backgroundImage: () => ({
        blueCircle: "url('./assets/decoration/blue.png')",
        orangeCircle: "url('./assets/decoration/orange.png')",
      }),
    },
  },
  plugins: [],
}