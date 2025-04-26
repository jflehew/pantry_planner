/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      textShadow: {
        sm: '1px 1px 2px rgba(0, 0, 0, 0.25)',
        DEFAULT: '2px 2px 4px rgba(0, 0, 0, 0.35)',
        lg: '3px 3px 6px rgba(0, 0, 0, 0.5)',
      },
      colors: {
        meadow: '#cdeac0',
        ash: '#a9a9a9',
        coal: '#1c1c1c',
        parchment: '#f8f8f2',
        bark: '#6e4b3a',
        mahogany: '#3c1e11',
        clay: '#924e40',
        steel: '#2f2f2f',
        graphite: '#3b3b3b',
        paper: '#f1f1f1',
        ink: '#aec6cf',
        mint: '#b3dec1',
        aqua: '#aeecef',
      },
      fontFamily: {
        organic: ['"Merriweather"', 'serif'],
        industrial: ['"Oswald"', 'sans-serif'],
        handwritten: ['"Shadows Into Light"', 'cursive'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-sm': {
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.25)',
        },
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.35)',
        },
        '.text-shadow-lg': {
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        }
      }
      addUtilities(newUtilities, ['responsive'])
    }
  ]
}

