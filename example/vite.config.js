import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

const r = (...path) => resolve(__dirname, ...path)

export default {
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '~': r('./src'),
      // alias to this package
      'vue-byte-guide': r('..'),
    },
  },
}
