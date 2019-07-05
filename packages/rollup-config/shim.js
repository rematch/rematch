import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

// point user to needed build
// based on env
const writeShimFile = (file, name) => {
	const shimSrc = `"use strict";module.exports="production"===process.env.NODE_ENV?require("./${name}.min.js"):require("./${name}.js");`
	mkdirSync(join('dist', folder))
	writeFileSync(join('dist', file), shimSrc)
}

const shim = (file, name) => {
	// generate root mapping files
	mkdirSync('dist')
	writeShimFile(file, name)
}

export default shim
