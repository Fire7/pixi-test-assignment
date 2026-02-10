import path from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(process.cwd(), 'src') }],
  },
})
