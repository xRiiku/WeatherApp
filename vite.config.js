import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: 'https://weather.rikudev.com', // Configura la ruta base de tu aplicación
  build: {
    outDir: 'dist', // Configura la carpeta de salida para los archivos generados por el comando npm run build
  },
})
