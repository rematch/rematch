import * as R from '../src/typings'
import { init } from '../src'

describe('init config:', () => {
	test('should not throw with an empty config', () => {
		expect(() => init()).not.toThrow()
	})
	test('should not accept invalid plugins', () => {
		expect(() =>
			init({
				plugins: {},
			} as R.InitConfig)
		).toThrow()
	})

	test('should ensure multiple middlewares are working', done => {
		const add5Middleware = () => next => action => {
			const newAction = { ...action }
			newAction.payload += 5
			return next(newAction)
		}

		const subtract2Middleware = store => next => action => {
			const state = store.getState()
			if (state.count > 1) {
				expect(state.count).toBe(6)
				done()
			}
			return next(action)
		}

		const store = init({
			models: {
				count: {
					state: 0,
					reducers: {
						addBy(state, payload) {
							return state + payload
						},
					},
				},
			},
			redux: {
				middlewares: [add5Middleware, subtract2Middleware],
			},
		})

		store.dispatch.count.addBy(1)
		store.dispatch.count.addBy(1)
	})

	test('should not accept invalid "middlewares"', () => {
		expect(() =>
			init({
				redux: {
					middlewares: {},
				},
			} as R.InitConfig)
		).toThrow()
	})

	test('should not accept invalid "enhancers"', () => {
		expect(() =>
			init({
				redux: {
					enhancers: {},
				},
			} as R.InitConfig)
		).toThrow()
	})

	test('should not accept invalid array for "reducers"', () => {
		expect(() =>
			init({
				redux: {
					reducers: [],
				},
			} as any)
		).toThrow()
	})

	test('should not accept invalid value as "reducers"', () => {
		expect(() =>
			init({
				redux: {
					reducers: 42,
				},
			} as any)
		).toThrow()
	})

	test('should run with devtool options', () => {
		const store = init({
			redux: {
				initialState: { a: 1 },
				devtoolOptions: {
					maxAge: 60000,
				},
			},
		})
		expect(store.getState()).toEqual({ a: 1 })
	})
})
