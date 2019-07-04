const { init } = require('../src')

describe('plugins:', () => {
	test('should add onModel subscription', () => {
		let messageFromOnModel = null
		init({
			models: {
				count: { state: 0 },
			},
			plugins: [
				{
					onModel: () => {
						messageFromOnModel = 'Hello, Rematch!'
					},
				},
			],
		})
		expect(messageFromOnModel).toEqual('Hello, Rematch!')
	})

	test('should add middleware', () => {
		const payloadIsAlways100Middleware = () => next => action => {
			return next({ ...action, payload: 100 })
		}
		const store = init({
			models: {
				a: {
					state: 0,
					reducers: { set: (state, payload) => payload },
				},
			},
			plugins: [{ middleware: payloadIsAlways100Middleware }],
		})
		store.dispatch.a.set(1)
		expect(store.getState()).toEqual({ a: 100 })
	})

	test('should add a model', () => {
		const a = {
			state: 0,
		}
		const plugin = {
			config: {
				models: { a },
			},
		}
		const store = init({
			plugins: [plugin],
		})
		expect(store.getState()).toEqual({ a: 0 })
	})

	test('should add multiple models', () => {
		const a = {
			state: 0,
		}
		const b = {
			state: 0,
		}
		const plugin = {
			config: {
				models: { a, b },
			},
		}
		const store = init({
			plugins: [plugin],
		})
		expect(store.getState()).toEqual({ a: 0, b: 0 })
	})

	test('should merge plugin configs into configs', () => {
		const plugin1 = {
			config: {
				redux: {
					initialState: {
						app: 1,
					},
				},
			},
		}
		const store = init({
			plugins: [plugin1],
		})
		expect(store.getState()).toEqual({ app: 1 })
	})

	test('plugins should be able to return a value', () => {
		const pluginWithReturn = {
			onStoreCreated: () => {
				return {
					returned: 42,
				}
			},
		}

		const store = init({
			plugins: [pluginWithReturn],
		})

		expect(store.returned).toEqual(42)
	})
})
