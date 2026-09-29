import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import { requireContentfulBuildConfig } from './src/services/contentful/config.ts'

export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    requireContentfulBuildConfig(loadEnv(mode, process.cwd(), ''))
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
    },
  }
})
