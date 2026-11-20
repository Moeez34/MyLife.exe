/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        desktopPink: '#E9B6D8',
        lavender: '#C9B3F2',
        lightLavender: '#E9DDF5',
        cyanY2k: '#75D5DC',
        retroYellow: '#F5CF72',
        winBg: '#E7E1DA',
        winText: '#171717',
      },
      fontFamily: {
        retro: ['"MS Sans Serif"', '"Pixelated MS Sans Serif"', 'Tahoma', 'Verdana', 'sans-serif'],
        pixel: ['"VT323"', 'monospace'],
      },
      boxShadow: {
        bevel: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080, 1px 1px 0 #000',
        bevelSm: 'inset 1px 1px 0 #fff, inset -1px -1px 0 #808080',
      }
    },
  },
  plugins: [],
}
