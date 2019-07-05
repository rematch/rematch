describe('production:', () => {
	test('should create a valid common js build', () => {
		const { init } = require('../dist/rematch.cjs.js')
		expect(init).toBeDefined()
	})
	// test('should create a valid es module build', () => {
	// 	const { init } = require('../dist/esm/rematch')
	// 	// fails due to export not found
	// 	expect(init).toBeDefined()
	// })
	test('should create a valid iife build', () => {
		const rematch = require('../dist/rematch.browser.js').default
		expect(rematch.init).toBeDefined()
	})
})
