import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const manualRollupChunks: Record<string, string> = {
  '@comunica': 'comunica',
  '@inrupt': 'inrupt',
  '@vue': 'vue'
}

const manualChunksResolver = (id: string) => Object.entries(manualRollupChunks).find(([keyword, chunk]) => id.includes(keyword))?.[1] ?? 'vendor'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/solid-todo-app-vue/',
  resolve: {
    alias: {
      buffer: 'buffer'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: manualChunksResolver
      }
    }
  }
})
