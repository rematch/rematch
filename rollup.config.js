import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import commonJs from 'rollup-plugin-commonjs'

const pkg = require('./package.json')

const env = process.env.NODE_ENV

const config = {
  input: 'lib/index.js',
  sourcemap: true,
  external: [],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    commonJs()
  ],
}

if (env === 'production') {
  config.plugins.push(uglify({
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      warnings: false,
    },
  }))
}

export default [Object.assign({}, config, {
  name: 'rematch',
  output: [
    { file: pkg.browser, format: 'umd', exports: 'named' },
  ],
}), Object.assign({}, config, {
  output: [
    { file: pkg.main, format: 'cjs', exports: 'named' },
    // { file: pkg.module, format: 'es', exports: 'named' },
  ],
})]
