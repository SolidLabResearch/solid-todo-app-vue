import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: process.env.TODO_APP_ROOT ?? '/',
  esbuild: {
    treeShaking: true
  },
  define: {
    global: 'globalThis'
  },
  build: {
    target: 'esnext',
    emptyOutDir: true,
    rollupOptions: {
      treeshake: true
    },
    commonjsOptions: {
      strictRequires: true
    }
  },
  resolve: {
    alias: {
      util: 'node_modules/readable-stream/lib/ours/util.js'
    }
  }
})
