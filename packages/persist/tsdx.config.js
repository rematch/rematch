const compiler = require('@ampproject/rollup-plugin-closure-compiler')

module.exports = {
	rollup(config) {
		config.plugins.push(compiler())
		return config
	},
}
