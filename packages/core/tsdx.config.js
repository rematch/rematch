module.exports = {
	rollup(config) {
		config.output.globals.redux = 'redux'
		return config
	},
}
