import { defineConfig } from 'vite';

// base relativa: el contenido de dist/ funciona en un subdominio de pruebas
// o dentro de una subcarpeta sin reescribir rutas.
export default defineConfig({
  base: './',
  plugins: []
});
