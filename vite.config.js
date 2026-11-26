import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base so the build works both on GitHub Pages (/skill-visualizer/) and locally.
  base: './',
  plugins: [react()],
})
