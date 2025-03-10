import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from "url";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '@components', replacement: fileURLToPath(new URL('./src/components', import.meta.url)) },
      { find: '@chain', replacement: fileURLToPath(new URL('./src/chain', import.meta.url)) },
      { find: '@util', replacement: fileURLToPath(new URL('./src/util', import.meta.url)) },
      { find: '@context', replacement: fileURLToPath(new URL('./src/context', import.meta.url)) },
    ],
  },
})
