import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import commonJs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'

import { minify } from 'uglify-es'
// experimental minifier for ES modules
// https://github.com/TrySound/rollup-plugin-uglify#warning

const pkg = require('./package.json')

const env = process.env.NODE_ENV

// minified production builds
const config = {
	input: 'src/index.ts',
	plugins: [
		replace({
			'process.env.NODE_ENV': JSON.stringify(env),
		}),
		typescript({
			typescript: require('typescript'),
		}),
		resolve({
			jsnext: true,
			browser: true,
		}),
		commonJs(),
	],
	output: [
		{
			name: 'Rematch',
			file: pkg.browser,
			format: 'umd',
			exports: 'named',
			sourcemap: true,
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
				},
				output: {
					comments: false,
					semicolons: false,
				},
				mangle: {
					reserved: ['payload', 'type', 'meta'],
				},
			},
			minify
		)
	)
}

export default [config]
