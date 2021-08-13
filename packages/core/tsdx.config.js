module.exports = {
	rollup(config) {
		config.output.globals.Redux = 'Redux'
		return config
	},
}
