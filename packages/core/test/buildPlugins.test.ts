import * as R from '../src/typings'
import { validatePlugin } from '../src/utils/validate'

describe('buildPlugins:', () => {
	test('should not create a plugin with invalid "onModel"', () => {
		const plugin1 = {
			onModel: {},
		} as R.Plugin
		expect(() => validatePlugin(plugin1)).toThrow()
	})

	test('should not create a plugin with invalid "createMiddleware"', () => {
		const plugin1 = {
			createMiddleware: {},
		} as R.Plugin
		expect(() => validatePlugin(plugin1)).toThrow()
	})
})
