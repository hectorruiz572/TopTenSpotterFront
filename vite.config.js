import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Si la aplicación está en la raíz
  // Si tu aplicación está en una subcarpeta, usa algo como:
  // base: '/mi-subcarpeta/'
})
