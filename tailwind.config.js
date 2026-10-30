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
        'tinta-muted': '#5d5873',
        violeta: '#2B1B7A',
        'violeta-hover': '#20135d',
        'violeta-light': '#f4f1fa',
        'violeta-border': '#d8d0ee',
        borde: '#e7e0d4',
        'borde-subtle': '#f0ebe1'
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      borderRadius: {
        btn: '8px'
      }
    }
  },
  plugins: []
};
