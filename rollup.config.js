import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import replace from 'rollup-plugin-replace'
import { uglify } from 'rollup-plugin-uglify'
import commonJs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'

import { minify } from 'uglify-es'
// experimental minifier for ES modules
// https://github.com/TrySound/rollup-plugin-uglify#warning

const pkg = require('./package.json')

// minified production builds
const production = {
	input: 'src/index.ts',
	output: [
		{
			file: `${pkg.main}/rematch.min.js`,
			format: 'cjs',
			exports: 'named',
			sourcemap: true,
		}, // CommonJS Modules
	],
	plugins: [
		typescript({
			typescript: require('typescript'),
		}),
		replace({
			'process.env.NODE_ENV': "'production'",
		}),
		resolve({
			jsnext: true,
			browser: true,
		}),
		commonJs(),
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
		),
	],
}

// full source development builds
const development = {
	input: 'src/index.ts',
	output: [
		{
			name: 'Rematch',
			file: pkg.browser,
			format: 'umd',
			exports: 'named',
			sourcemap: true,
		}, // Universal Modules
		{ file: `${pkg.main}/rematch.js`, format: 'cjs', exports: 'named' }, // CommonJS Modules
		{ file: pkg.module, format: 'es', exports: 'named', sourcemap: true }, // ES Modules
	],
	plugins: [
		typescript({
			typescript: require('typescript'),
		}),
		replace({
			'process.env.NODE_ENV': '"development"',
		}),
		resolve({
			jsnext: true,
			browser: true,
		}),
		commonJs(),
	],
}

// point user to needed build
const root = `'use strict'module.exports=process.env.NODE_ENV==='production'?require('./rematch.min.js'):require('./rematch.js')`

const rootFile = folder => {
	mkdirSync(join('dist', folder))
	writeFileSync(join('dist', folder, 'index.js'), root)
}

export default (() => {
	// generate root mapping files
	mkdirSync('dist')
	rootFile('cjs')

	return [development, production]
})()
