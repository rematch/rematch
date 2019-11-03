#!/bin/env

const { statSync, existsSync } = require('fs')
const { join } = require('path')

function printSizeCJS(folder) {
	const prod = statSync(`dist/${folder}/rematch.prod.min.js`).size
	let diff = '--'
	if (existsSync(`dist/${folder}/rematch.dev.js`)) {
		const dev = statSync(`dist/${folder}/rematch.dev.js`).size
		diff = ((prod / dev) * 100).toFixed(2)
	}
	console.log(`${folder.toUpperCase()}: ${prod} kb (${diff}%)`)
}

function printSize(folder) {
	if (existsSync(`dist/${folder}/rematch.js`)) {
		const size = statSync(`dist/${folder}/rematch.js`).size
		console.log(`${folder.toUpperCase()}: ${size} kb`)
	}
}

console.log('Minified Bundle Sizes')
printSizeCJS('cjs')
printSize('esm')
printSize('umd')
