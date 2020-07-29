import { Middleware } from 'redux'
import { init } from '../src'

describe('init config:', () => {
	test('should not throw with an empty config', () => {
		expect(() => init()).not.toThrow()
	})

	test('should not accept invalid plugins', () => {
		expect(() =>
			init({
				models: {},
				// @ts-expect-error
				plugins: {},
			})
		).toThrow()
	})

	test('should ensure multiple middlewares are working', () => {
		const add5Middleware: Middleware = () => (next) => (action): any => {
			const newAction = { ...action }
			newAction.payload += 5
			return next(newAction)
		}

		const subtract2Middleware: Middleware = () => (next) => (action): any => {
			const newAction = { ...action }
			newAction.payload -= 2
			return next(newAction)
		}

		const store = init({
			models: {
				count: {
					state: 0,
					reducers: {
						addBy(state: number, payload: number): number {
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

		const state = store.getState()
		expect(state.count).toBe(8)
	})

	test('should not accept invalid "middlewares"', () => {
		expect(() =>
			init({
				redux: {
					// @ts-expect-error
					middlewares: {},
				},
			})
		).toThrow()
	})

	test('should not accept invalid "enhancers"', () => {
		expect(() =>
			init({
				redux: {
					// @ts-expect-error
					enhancers: {},
				},
			})
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
