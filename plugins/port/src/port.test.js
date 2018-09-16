import { init } from '../../../src'
import port from './port'

describe('ports:', () => {
	test('can be an empty plugin', () => {
		const plugin = port()
		const start = () =>
			init({
				plugins: [plugin],
			})
		expect(start).not.toThrow()
	})

	test('exposes values on store', () => {
		const plugin = port({
			expose: { chicken: 'dinner' },
		})
		const store = init({
			plugins: [plugin],
		})

		expect(store.chicken).toBe('dinner')
	})

	test('replaces combineReducers', () => {
		const combineReducers = reducers => (state, action) => {
			for (const r of Object.keys(reducers)) {
				state[r] = 'golden'
			}
			return state
		}
		const model = {
			state: 0,
			reducers: {
				flail: state => state,
			},
		}
		const plugin = port({
			combineReducers,
		})
		const store = init({
			models: { fish: model },
			plugins: [plugin],
		})

		store.dispatch.fish.flail()

		expect(store.getState().fish).toBe('golden')
	})

	test('adds middleware to store', () => {
		const middleware = s => next => action =>
			next({ ...action, payload: 'frank' })
		const plugin = port({
			modelName: 'test',
			reducer: (state, action) =>
				action.type === 'hello' ? action.payload : state,
			middleware,
		})
		const store = init({
			plugins: [plugin],
		})

		store.dispatch({ type: 'hello', payload: 'world' })

		expect(store.getState().test).toBe('frank')
	})

	test('maps reducers', () => {
		const model = {
			state: 0,
			reducers: {
				up(state) {
					return state + 1
				},
			},
		}
		const plugin = port({
			mapReducers: reducers => {
				const mapped = {}
				for (const reducerName of Object.keys(reducers)) {
					mapped[reducerName] = (state, action) => {
						return action.type.split('/')[0] == reducerName
							? reducers[reducerName](state, action) + 1
							: reducers[reducerName](state, action)
					}
				}
				return mapped
			},
		})
		const store = init({
			models: { chicken: model, beef: model },
			plugins: [plugin],
		})

		store.dispatch.chicken.up()
		store.dispatch.beef.up()
		store.dispatch.beef.up()

		expect(store.getState().chicken).toBe(2)
		expect(store.getState().beef).toBe(4)
	})

	test('maps root reducer', () => {
		const model = {
			state: 0,
			reducers: {
				up(state) {
					return state + 1
				},
			},
		}
		const plugin = port({
			mapRootReducer: reducer => (state, action) => {
				const next = reducer(state, action)
				for (const key of Object.keys(next)) {
					next[key] =
						action.type.split('/')[0] == key ? next[key] + 1 : next[key]
				}
				return next
			},
		})
		const store = init({
			models: { chicken: model, beef: model },
			plugins: [plugin],
		})

		store.dispatch.chicken.up()
		store.dispatch.beef.up()
		store.dispatch.beef.up()
		expect(store.getState().chicken).toBe(2)
		expect(store.getState().beef).toBe(4)
	})

	describe('ported model:', () => {
		it('should register a model', () => {
			const plugin = port({
				modelName: 'george',
			})
			const store = init({
				plugins: [plugin],
			})
			expect(store.dispatch.george).toBeDefined()
		})

		it('should reduce to that model', () => {
			const plugin = port({
				modelName: 'george',
				reducer: (state, action) => {
					if (action.type === 'gnarly') {
						return 'stoked'
					} else {
						return state
					}
				},
				actionCreators: {
					shredSomeGnar() {
						return { type: 'gnarly' }
					},
				},
			})
			const store = init({
				plugins: [plugin],
			})

			store.dispatch.george.shredSomeGnar()

			expect(store.getState().george).toBe('stoked')
		})
	})
})
