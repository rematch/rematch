import { Plugin } from '../src'
import { validatePlugin } from '../src/validate'

describe('validatePlugins:', () => {
	test('should not create a plugin with invalid "onModel"', () => {
		const plugin = {
			onModel: {},
		} as Plugin<{}>
		expect(() => validatePlugin(plugin)).toThrow()
	})

	test('should not create a plugin with invalid "createMiddleware"', () => {
		const plugin = {
			createMiddleware: {},
		} as Plugin<{}>
		expect(() => validatePlugin(plugin)).toThrow()
	})
})
