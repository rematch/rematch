module.exports = {
	rollup(config) {
		if (config.output.format === 'esm') {
			config.output.file = config.output.file.replace('.js', '.mjs')
		}

		return config
	},
}
