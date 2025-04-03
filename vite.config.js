import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs';

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    commonjs(),
    react({
      babel: {
        babelrc: true
      }
    })
  ],
  define: {
    'process.env': {}
  },
  server: {
    hmr: {
      clientPort: 5173
    }
  },
  build: {
    target: 'es2015'
  }
})
