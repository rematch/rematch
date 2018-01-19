import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import commonJs from 'rollup-plugin-commonjs'

import { minify } from 'uglify-es'
// experimental minifier for ES modules
// https://github.com/TrySound/rollup-plugin-uglify#warning

const pkg = require('./package.json')

const env = process.env.NODE_ENV

const config = {
  input: 'lib/index.js',
  external: [
    'react',
    'react-redux',
    'react-native',
    'react-navigation'
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    commonJs()
  ],
  output: [
    { file: pkg.main, format: 'cjs', exports: 'named', sourcemap: true, }, // CommonJS Modules
    { file: pkg.module, format: 'es', exports: 'named', sourcemap: true, } // ES Modules
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
