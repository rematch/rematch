import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import commonJs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'

import { minify } from 'uglify-es'
// experimental minifier for ES modules
// https://github.com/TrySound/rollup-plugin-uglify#warning

const pkg = require('./package.json')

const env = process.env.NODE_ENV

const config = {
	input: 'src/index.ts',
	external: ['reselect'],
	plugins: [
		typescript({
			typescript: require('typescript'),
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify(env),
		}),
		commonJs(),
	],
	output: [
		{
			name: 'RematchSelect',
			file: pkg.browser,
			format: 'umd',
			exports: 'named',
			sourcemap: true,
			globals: {
				reselect: 'reselect',
			},
		}, // Universal Modules
		{ file: pkg.main, format: 'cjs', exports: 'named', sourcemap: true }, // CommonJS Modules
		{ file: pkg.module, format: 'es', exports: 'named', sourcemap: true }, // ES Modules
	],
}

if (env === 'production') {
	config.plugins.push(
		uglify(
			{
				compress: {
					pure_getters: true,
					unsafe: true,
					unsafe_comps: true,
					warnings: false,
				},
			},
			minify
		)
	)
}

export default [config]
