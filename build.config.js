import { resolve } from 'path'

const r = (...args) => resolve(__dirname, ...args)

export default {
  entries: [
    { builder: 'mkdist', input: r('./src'), outDir: r('./lib') },
    { builder: 'rollup', input: r('./src/index'), outDir: r('./dist') },
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    output: {
      exports: 'named',
      assetFileNames: '[name].[extname]',
    },
  },
}
