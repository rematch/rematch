import { init, ModelDispatcher, Models } from '../src'

describe('dispatch:', () => {
	describe('action:', () => {
		it('should be called in the form "modelName/reducerName"', () => {
			type CountState = number

			const count = {
				state: 0,
				reducers: {
					add: (state: CountState): CountState => state + 1,
				},
			}

			const store = init({
				models: { count },
			})

			store.dispatch({ type: 'count/add' })

			expect(store.getState()).toEqual({
				count: 1,
			})
		})

		it('should be able to call dispatch directly', () => {
			type CountState = number

			const count = {
				state: 0,
				reducers: {
					addOne: (state: CountState): CountState => state + 1,
				},
			}

			const store = init({
				models: { count },
			})

			store.dispatch({ type: 'count/addOne' })

			expect(store.getState()).toEqual({
				count: 1,
			})
		})

		it('should dispatch an action', () => {
			type CountState = number

			const count = {
				state: 0,
				reducers: {
					add: (state: CountState): CountState => state + 1,
				},
			}

			const store = init({
				models: { count },
			})

			const dispatched = store.dispatch.count.add()

			expect(store.getState()).toEqual({
				count: 1,
			})
			expect(typeof dispatched).toBe('object')
		})

		it('should dispatch multiple actions', () => {
			type CountState = number

			const count = {
				state: 0,
				reducers: {
					add: (state: CountState): CountState => state + 1,
				},
			}

			const store = init({
				models: { count },
			})

			store.dispatch.count.add()
			store.dispatch.count.add()

			expect(store.getState()).toEqual({
				count: 2,
			})
		})

		it('should handle multiple models', () => {
			type CountState = number

			const a = {
				state: 42,
				reducers: {
					add: (state: CountState): CountState => state + 1,
				},
			}

			const b = {
				state: 0,
				reducers: {
					add: (state: CountState): CountState => state + 1,
				},
			}

			const store = init({
				models: { a, b },
			})

			store.dispatch.a.add()
			store.dispatch.b.add()

			expect(store.getState()).toEqual({
				a: 43,
				b: 1,
			})
		})

		it('should pass the meta object as the third param', () => {
			type CountState = {
				count: number
				meta: any
			}

			const count = {
				state: {
					count: 0,
					meta: null,
				} as CountState,
				reducers: {
					add: (
						state: CountState,
						payload: number,
						meta?: Record<string, any>
					): CountState => {
						return {
							count: state.count + payload,
							meta,
						}
					},
				},
			}

			const store = init({
				models: { count },
			})

			// TODO: type of `add` inferred incorrectly.
			store.dispatch.count.add(1, { some_meta: true })

			expect(store.getState().count).toEqual({
				count: 1,
				meta: { some_meta: true },
			})
		})
	})

	it('should include a payload if it is a false value', () => {
		type AState = boolean

		const a = {
			state: true,
			reducers: {
				toggle: (_: AState, payload: boolean): boolean => payload,
			},
		}

		type RootModel = {
			a: typeof a
		}

		const models: RootModel = { a }

		const store = init({
			models,
		})

		store.dispatch.a.toggle(false)

		expect(store.getState()).toEqual({
			a: false,
		})
	})

	it('should throw if the reducer name is invalid', () => {
		const store = init()

		expect(() =>
			store.addModel({
				name: 'a',
				state: 42,
				reducers: {
					'model/invalid/name': (): number => 43,
				},
			})
		).toThrow()
	})

	it('should throw if the reducer is not a function', () => {
		const store = init()

		expect(() =>
			store.addModel({
				name: 'a',
				state: 42,
				reducers: {
					is43: 43,
				},
			} as any)
		).toThrow()
	})

	describe('params:', () => {
		it('should pass state as the first reducer param', () => {
			type CountState = number

			const count = {
				state: 0,
				reducers: {
					doNothing: (state: CountState): CountState => state,
				},
			}

			const store = init({
				models: { count },
			})

			store.dispatch.count.doNothing()

			expect(store.getState()).toEqual({
				count: 0,
			})
		})

		it('should pass payload as the second param', () => {
			type CountState = {
				countIds: number[]
			}

			const count = {
				state: {
					countIds: [],
				} as CountState,
				reducers: {
					incrementBy: (state: CountState, payload: number): CountState => {
						return {
							...state,
							countIds: [...state.countIds, payload],
						}
					},
				},
			}

			const store = init({
				models: { count },
			})

			store.dispatch.count.incrementBy(5)

			expect(store.getState().count.countIds).toEqual([5])
		})
	})

	describe('promise middleware', () => {
		it('should return a promise from an effect', () => {
			type CountState = number
			type CountModel = {
				state: CountState
				reducers: {
					addOne(state: CountState): CountState
				}
				effects: {
					callAddOne(): Promise<void>
				}
			}

			interface RootModel extends Models<RootModel> {
				example: CountModel
			}

			const count: CountModel = {
				state: 0,
				reducers: {
					addOne: (state: CountState): CountState => state + 1,
				},
				effects: {
					async callAddOne(
						this: ModelDispatcher<CountModel, RootModel>
					): Promise<void> {
						this.addOne()
					},
				},
			}

			const store = init({
				models: { count },
			})

			const dispatched = store.dispatch.count.callAddOne()

			expect(typeof dispatched.then).toBe('function')
		})

		it('should return a promise that resolves to a value from an effect', async () => {
			type CountState = number
			type CountModel = {
				state: number
				reducers: {
					addOne(state: CountState): CountState
				}
				effects: {
					callAddOne(): Promise<Record<string, any>>
				}
			}

			interface RootModel extends Models<RootModel> {
				example: CountModel
			}

			const count: CountModel = {
				state: 0,
				reducers: {
					addOne: (state: CountState): CountState => state + 1,
				},
				effects: {
					async callAddOne(
						this: ModelDispatcher<CountModel, RootModel>
					): Promise<Record<string, any>> {
						this.addOne()
						return {
							added: true,
						}
					},
				},
			}

			const store = init({
				models: { count },
			})

			const dispatched = store.dispatch.count.callAddOne()

			expect(typeof dispatched.then).toBe('function')

			const value = await dispatched
			expect(value).toEqual({ added: true })
		})
	})

	it('should not validate dispatch if production', () => {
		process.env.NODE_ENV = 'production'
		type CountState = number

		const count = {
			state: 0,
			reducers: {
				'add/invalid': (state: CountState): CountState => state + 1,
			},
		}

		expect(() =>
			init({
				models: { count },
			})
		).not.toThrow()
	})
})
