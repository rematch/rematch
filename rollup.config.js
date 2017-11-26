import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import commonJs from 'rollup-plugin-commonjs'

import { minify } from 'uglify-es'
// experimental minifier to es modules
// https://github.com/TrySound/rollup-plugin-uglify#warning

const pkg = require('./package.json')

const env = process.env.NODE_ENV

const config = {
  input: 'lib/index.js',
  sourcemap: true,
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    commonJs({
      // include: ['node_modules/redux/**']
    })
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

export default [
  // Universal Module
  Object.assign({}, config, {
  name: 'rematch',
  output: [
    { file: pkg.browser, format: 'umd', exports: 'named' },
  ],
}),
  // CommonJS
  Object.assign({}, config, {
  output: [
    { file: pkg.main, format: 'cjs', exports: 'named' },
  ],
}),
  // ES Modules
  Object.assign({}, config, {
    output: {
      file: pkg.module, format: 'es', exports: 'named',
    },
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      commonJs(),
      uglify({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }, minify)
    ],
  })
]
