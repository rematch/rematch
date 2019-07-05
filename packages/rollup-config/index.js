import { resolve } from 'path'
import replace from 'rollup-plugin-replace'
import typescript from 'rollup-plugin-typescript'
import uglify from 'rollup-plugin-uglify'

import { minify } from 'uglify-es'
// experimental minifier for ES modules
// https://github.com/TrySound/rollup-plugin-uglify#warning

import camelize from './lib/camelize'

const env = process.env.NODE_ENV
const pkg = require(resolve('package.json'))
const pkgNamespace = camelize(pkg.name.split('/')[1])
const node_modules = [
	...Object.keys(pkg.dependencies || {}),
	...Object.keys(pkg.peerDependencies || {}),
]

const input = 'src/index.ts'

const plugins = [
	typescript({
		typescript: require('typescript'),
	}),
	replace({
		'process.env.NODE_ENV': JSON.stringify(env),
	}),
]

const productionPlugins = [
	...plugins,
	uglify(
		{
			compress: {
				pure_getters: true,
				unsafe: true,
				unsafe_comps: true,
				warnings: false,
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
	),
]

export default ({
	namespace,
	cjs = true,
	esm = true,
	iife = !!pkg.browser,
	sourcemap = true,
} = {}) => {
	const name = 'rematch.' + namespace || pkgNamespace

	const rollupBuild = {
		input,
		plugins: env === 'production' ? productionPlugins : plugins,
		external: node_modules,
		output: [],
	}

	if (iife) {
		rollupBuild.output.push({
			name,
			sourcemap,
			file: pkg.browser,
			format: 'iife',
			exports: 'named',
		})
	}

	if (esm) {
		rollupBuild.output.push({
			sourcemap,
			file: pkg.module,
			format: 'es',
			exports: 'named',
		})
	}

	if (cjs) {
		rollupBuild.output.push({
			sourcemap,
			file: pkg.main,
			format: 'cjs',
			exports: 'named',
		})
	}

	return rollupBuild
}
