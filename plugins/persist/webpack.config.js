/* global __dirname, require, module */

const webpack = require('webpack')
const path = require('path')
const packageName = require('./package.json').name
const { env } = require('yargs').argv

const { UglifyJsPlugin } = webpack.optimize

const plugins = []
let outputFile

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }))
  outputFile = 'index.min.js'
} else {
  outputFile = 'index.js'
}

const config = {
  entry: `${__dirname}/src/index.js`,
  devtool: 'source-map',
  output: {
    path: `${__dirname}/lib`,
    filename: outputFile,
    library: packageName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader!eslint-loader',
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js'],
  },
  plugins,
}

module.exports = config
