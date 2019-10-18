const PluginFactory = require('../src/pluginFactory').default

describe('buildPlugins:', () => {
	test('should not create a plugin with invalid "onModel"', () => {
		const pluginFactory = new PluginFactory()
		const plugin1 = {
			onModel: {},
		}
		expect(() => pluginFactory.create(plugin1)).toThrow()
	})

	test('should not create a plugin with invalid "middleware"', () => {
		const pluginFactory = new PluginFactory()
		const plugin1 = {
			middleware: {},
		}
		expect(() => pluginFactory.create(plugin1)).toThrow()
	})
})
