import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['4c819f983cab.ngrok-free.app'], // 👈 Add your ngrok domain here
    host: true,  // Allows access from network/IP
  },
})
