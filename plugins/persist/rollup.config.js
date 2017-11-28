import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import commonJs from 'rollup-plugin-commonjs'

import { minify } from 'uglify-es'
// experimental minifier for ES modules
// https://github.com/TrySound/rollup-plugin-uglify#warning

const pkg = require('./package.json')

const env = process.env.NODE_ENV

const config = {
  name: 'rematch-persist',
  input: 'lib/index.js',
  sourcemap: true,
  externals: ['redux-persist', 'redux-persist/lib/storage'],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    commonJs({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    })
  ],
  output: [
    { file: pkg.browser, format: 'umd', exports: 'named' }, // Universal Modules
    { file: pkg.main, format: 'cjs', exports: 'named' }, // CommonJS Modules
    { file: pkg.module, format: 'es', exports: 'named' } // ES Modules
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
  }, minify))
}

export default [config]
