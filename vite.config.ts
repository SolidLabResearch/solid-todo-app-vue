import { defineConfig } from 'vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyfill from 'rollup-plugin-node-polyfills'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6'
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      plugins: [NodeGlobalsPolyfillPlugin({ process: true, buffer: true }), NodeModulesPolyfillPlugin()]
    }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('@comunica')) {
            return 'comunica'
          } else if (id.includes('@inrupt')) {
            return 'inrupt'
          } else {
            return 'vendor'
          }
        }
      },
      plugins: [
        // @ts-ignore
        rollupNodePolyfill()
      ]
    }
  }
})
