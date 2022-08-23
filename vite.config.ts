import { defineConfig } from 'vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyfill from 'rollup-plugin-node-polyfills'

import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [NodeGlobalsPolyfillPlugin({process: true, buffer: true}), NodeModulesPolyfillPlugin()]
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyfill()
      ]
    }
  }
})
