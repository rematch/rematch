// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = function () {
	return {
		name: 'copy-to-clipbard-plugin',
		getClientModules() {
			return [path.resolve(__dirname, './client')]
		},
	}
}
