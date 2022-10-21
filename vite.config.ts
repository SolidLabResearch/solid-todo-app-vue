import { defineConfig } from 'vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import rollupNodePolyfill from 'rollup-plugin-node-polyfills'
import vue from '@vitejs/plugin-vue'

const manualRollupChunks: Record<string, string> = {
  '@comunica': 'comunica',
  '@inrupt': 'inrupt',
  '@vue': 'vue'
}

const manualChunksResolver = (id: string) => {
  for (const [keyword, chunk] of Object.entries(manualRollupChunks)) {
    if (id.includes(keyword)) {
      return chunk
    }
  }
  return 'vendor'
}

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
        manualChunks: manualChunksResolver
      },
      plugins: [
        // @ts-ignore
        rollupNodePolyfill()
      ]
    }
  }
})
