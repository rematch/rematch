import fs from 'fs'
import path from 'path'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import commonJs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'

import { minify } from 'uglify-es'
// experimental minifier for ES modules
// https://github.com/TrySound/rollup-plugin-uglify#warning

const pkg = require('./package.json')

const env = process.env.NODE_ENV

// skips local files
const namedAreExternal = () => ({
	name: 'named-are-external',
	resolveId: id =>
		!id.startsWith('src') || id.startsWith('.') ? false : undefined,
})

const makeConfig = (name, opts) => {
	const config = {
		...opts,
		plugins: [
			replace({
				'process.env.NODE_ENV': JSON.stringify(env),
			}),
			typescript({
				typescript: require('typescript'),
			}),
			commonJs(),
			namedAreExternal(),
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

	return config
}

const main = makeConfig('RematchPort', {
	input: 'src/index.ts',
	output: [
		{
			name: 'RematchPort',
			file: pkg.browser,
			format: 'umd',
			exports: 'named',
			sourcemap: true,
		}, // Universal Modules
		{ file: pkg.main, format: 'cjs', exports: 'named', sourcemap: true }, // CommonJS Modules
		{ file: pkg.module, format: 'es', exports: 'named', sourcemap: true }, // ES Modules
	],
})

const plugins = fs
	.readdirSync('./src/recipe')
	.filter(file => !file.endsWith('.test.ts'))
	.map(file => {
		const pluginName = path.basename(file).split('.ts')[0]
		return makeConfig('RematchPortRecipe', {
			input: `./src/recipe/${file}`,
			output: [
				{
					file: `./recipe/${pluginName}.js`,
					format: 'cjs',
					exports: 'named',
					sourcemap: true,
				}, // CommonJS Modules
				{
					file: `./recipe/${pluginName}.esm.js`,
					format: 'es',
					exports: 'named',
					sourcemap: true,
				}, // ES Modules
			],
		})
	})

export default [main, ...plugins]
