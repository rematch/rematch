#!/bin/env

const { statSync } = require('fs')
const { join } = require('path')

const printSize = (folder) => {
  const prod = statSync(`dist/${folder}/rematch.prod.min.js`).size
  const dev = statSync(`dist/${folder}/rematch.dev.js`).size
  const diff = ((prod / dev) * 100).toFixed(2)
  console.log(`${folder.toUpperCase()}: ${prod} kb (${diff}%)`)
}

console.log('Minified Bundle Sizes')
printSize('cjs')
printSize('esm')
printSize('umd')
