/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        palette: {
          pinkLight: '#d99bb7',
          mauve: '#a36d8a',
          pink: '#e03a7d',
          burgundy: '#7a0e2a',
          blue: '#466a85',
          cyan: '#2bb3d2',
          lime: '#b2b800',
          mint: '#c6f7b2',
          sage: '#a3c7a2',
          olive: '#5a6a2c',
        },
      },
    },
  },
  plugins: [],
}

