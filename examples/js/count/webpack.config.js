module.exports = {
  entry: {
    app: './src',
  },
  output: {
    path: `${__dirname}/public`,
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
      }
    ]
  }
}
