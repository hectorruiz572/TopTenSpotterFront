import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Configuración de la ruta base para despliegues en subcarpeta
  base: '/TopTenSpotterFront/', // Ajusta esto si tu aplicación se encuentra en una subcarpeta
  build: {
    outDir: 'dist',  // O 'docs', dependiendo de lo que prefieras
  },
})
