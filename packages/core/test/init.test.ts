import { init } from '../src'

describe('init:', () => {
	test('no params should create store with state `{}`', () => {
		const store = init()

		expect(store.getState()).toEqual({})
	})

	test('should create models', () => {
		const store = init({
			models: {
				app: {
					state: 'Hello, model 1',
					reducers: {},
				},
				app2: {
					state: 'Hello, model 2',
					reducers: {},
				},
			},
		})

		expect(store.getState()).toEqual({
			app: 'Hello, model 1',
			app2: 'Hello, model 2',
		})
	})

	test('should allow both init models & model models', () => {
		const store = init({
			models: {
				app: {
					state: 'Hello, model 1',
					reducers: {},
				},
			},
		})

		store.addModel({
			name: 'app2',
			state: 'Hello, model 2',
			reducers: {},
		})

		expect(store.getState()).toEqual({
			app: 'Hello, model 1',
			app2: 'Hello, model 2',
		})
	})

	test('should throw if models are not an object', () => {
		const model = {
			name: 'app',
			state: 'Hello, world',
			reducers: {},
		}

		expect(() =>
			init({
				models: [model],
			} as any)
		).toThrow()
	})

	test('init() & one model of state type `string`', () => {
		const store = init()

		store.addModel({
			name: 'app',
			state: 'Hello, world',
			reducers: {},
		})

		expect(store.getState()).toEqual({
			app: 'Hello, world',
		})
	})

	test('init() & one model of state type `number`', () => {
		const store = init()

		store.addModel({
			name: 'count',
			state: 99,
			reducers: {},
		})

		expect(store.getState()).toEqual({
			count: 99,
		})
	})

	test('init() & one model of state is 0', () => {
		const store = init()

		store.addModel({
			name: 'count',
			state: 0,
			reducers: {},
		})

		expect(store.getState()).toEqual({
			count: 0,
		})
	})

	test('init() & one model of state type `object`', () => {
		const store = init()

		store.addModel({
			name: 'todos',
			state: {
				abc: {
					text: 'PRty down',
					done: true,
				},
			},
			reducers: {},
		})

		expect(store.getState()).toEqual({
			todos: {
				abc: {
					text: 'PRty down',
					done: true,
				},
			},
		})
	})
	test('init() & two models', () => {
		const store = init()

		store.addModel({
			name: 'app',
			state: 'Hello, world',
			reducers: {},
		})

		store.addModel({
			name: 'count',
			state: 99,
			reducers: {},
		})

		expect(store.getState()).toEqual({
			app: 'Hello, world',
			count: 99,
		})
	})

	test('init() & three models', () => {
		const store = init()

		store.addModel({
			name: 'app',
			state: 'Hello, world',
			reducers: {},
		})

		store.addModel({
			name: 'count',
			state: 99,
			reducers: {},
		})

		store.addModel({
			name: 'todos',
			state: {
				abc: {
					text: 'PRty down',
					done: true,
				},
			},
			reducers: {},
		})

		expect(store.getState()).toEqual({
			app: 'Hello, world',
			count: 99,
			todos: {
				abc: {
					text: 'PRty down',
					done: true,
				},
			},
		})
	})
	test('should not validate if production', () => {
		process.env.NODE_ENV = 'production'

		const model = {
			name: 'app',
			state: 'Hello, world',
		}

		expect(() =>
			init({
				models: [model],
			} as any)
		).not.toThrow()
	})
})
