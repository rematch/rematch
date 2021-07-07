import { createModel, init, MiddlewareCreator, Models, Plugin } from '../src'

describe('plugins:', () => {
	test('should add onModel subscription', () => {
		let messageFromOnModel: any = null
		init({
			models: {
				count: { state: 0, reducers: {} },
			},
			plugins: [
				{
					onModel: (): void => {
						messageFromOnModel = 'Hello, Rematch!'
					},
				},
			],
		})

		expect(messageFromOnModel).toEqual('Hello, Rematch!')
	})

	test('should add middleware', () => {
		const a = createModel<RootModel>()({
			state: 0,
			reducers: {
				set: (_state: number, payload: number): number => payload,
			},
		})

		interface RootModel extends Models<RootModel> {
			a: typeof a
		}

		const payloadIsAlways100Middleware: MiddlewareCreator<RootModel> = () => () => (
			next
		) => (action): any => {
			return next({ ...action, payload: 100 })
		}

		const store = init<RootModel>({
			models: {
				a,
			},
			plugins: [{ createMiddleware: payloadIsAlways100Middleware }],
		})

		store.dispatch.a.set(1)

		expect(store.getState()).toEqual({ a: 100 })
	})

	test('should add a model', () => {
		const a = {
			state: 0,
			reducers: {},
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
			reducers: {},
		}
		const b = {
			state: 0,
			reducers: {},
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

	test('plugins should be able to set a value in store', () => {
		const pluginWithReturn: Plugin<{}> = {
			onStoreCreated: (store): void => {
				// @ts-expect-error
				store.returned = 42 // when creating plugin, we would need to expand type for the rematch store to include 'returned'
			},
		}

		const store = init({
			plugins: [pluginWithReturn],
		})

		expect(store.returned).toEqual(42)
	})
})
