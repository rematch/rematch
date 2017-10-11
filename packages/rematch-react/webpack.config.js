/* global __dirname, require, module */

const webpack = require('webpack')
const path = require('path')
const env = require('yargs').argv.env
const libraryName = require('./package.json').name

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin

const plugins = []
let outputFile

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }))
  outputFile = `${libraryName}.min.js`
} else {
  outputFile = `${libraryName}.js`
}

const config = {
  entry: `${__dirname}/src/index.js`,
  devtool: 'source-map',
  output: {
    path: `${__dirname}/lib`,
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js'],
  },
  plugins,
}

module.exports = config
