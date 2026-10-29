/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        crema: '#fbf7f1',
        tinta: '#17132b',
        'tinta-dark': '#0f0c1e',
        'tinta-card': '#231d40',
        violeta: '#6b3cff',
        'violeta-light': '#ede6ff',
        'violeta-pastel': '#c9b6ff',
        lima: '#c9f45c',
        'lima-pastel': '#e6fb9f',
        coral: '#ff6b4a',
        'coral-pastel': '#ffc2b0',
        cielo: '#4cc2f5',
        'cielo-card': '#e0f4fd',
        menta: '#38d39f',
        'menta-card': '#ddf8ee',
        sol: '#ffc93c',
        borde: '#e7e0d4',
        muted: '#5d5873'
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif']
      }
    }
  },
  plugins: []
};
