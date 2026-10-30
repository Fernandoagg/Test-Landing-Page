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
        muted: '#5d5873',
        marino: '#0F2A4A',
        'marino-hover': '#0A1F38',
        'marino-light': '#EEF2F7',
        'marino-border': '#CBD6E4',
        // Ámbar: solo detalles (líneas, íconos, números) sobre fondo marino
        ambar: '#F2A93B',
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
