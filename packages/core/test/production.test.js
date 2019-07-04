describe('production:', () => {
	test('should create a valid common js build', () => {
		const { init } = require('../dist/cjs/rematch')
		expect(init).toBeDefined()
	})
	// test('should create a valid es module build', () => {
	// 	const { init } = require('../dist/esm/rematch')
	// 	// fails due to export not found
	// 	expect(init).toBeDefined()
	// })
	test('should create a valid universal module build', () => {
		const rematch = require('../dist/umd/rematch').default
		expect(rematch.init).toBeDefined()
	})
})
