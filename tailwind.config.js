/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        palette: {
          // Open Peeps inspired
          peach: '#FFD6C0',
          yellow: '#FFF6A3',
          green: '#B6E2D3',
          blue: '#A7C7E7',
          purple: '#D1B3C4',
          grayLight: '#F5F5F5',
          gray: '#E0E0E0',
          grayDark: '#BDBDBD',
          black: '#222222',
          // Existing colors (for reference, can be removed later)
          pinkLight: '#d99bb7',
          mauve: '#a36d8a',
          pink: '#e03a7d',
          burgundy: '#7a0e2a',
          blueOld: '#466a85',
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

