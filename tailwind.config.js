/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        // Fondo base y texto
        arena: '#FFF8EE',
        tinta: '#1B2A2F',
        'tinta-muted': '#4F5F63',
        muted: '#4F5F63',
        // Color principal: botones, bandas y enlaces (blanco encima)
        teal: {
          DEFAULT: '#0B5C66',
          hover: '#084852',
          claro: '#DDF1EF'
        },
        // Coral: el tono puro solo en fondos, íconos, líneas y detalles;
        // para texto se usa siempre coral-oscuro
        coral: {
          DEFAULT: '#F26B4F',
          oscuro: '#C4452C',
          suave: '#FFE3DC'
        },
        // Sol: solo sobre fondos teal o tinta (sol-suave: fondo de ícono)
        sol: {
          DEFAULT: '#FFC93C',
          suave: '#FFF0C7'
        },
        // Tonos exclusivos de la sección Especialidades
        cielo: {
          DEFAULT: '#CFE6F2',
          texto: '#1E5A7A'
        },
        menta: {
          DEFAULT: '#D8F2E6',
          texto: '#17684A'
        },
        borde: '#EADFCF',
        'borde-subtle': '#F3EBDF'
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      borderRadius: {
        card: '20px',
        btn: '12px',
        field: '12px'
      }
    }
  },
  plugins: []
};
