import { Middleware } from 'redux'
import { init, ModelDispatcher, Models } from '../src'

describe('effects:', () => {
	test('should create an action', () => {
		const count = {
			state: 0,
			effects: {
				add: (): number => 1,
			},
			reducers: {},
		}

		const store = init({
			models: { count },
		})

		expect(typeof store.dispatch.count.add).toBe('function')
	})

	test('first param should be payload', async () => {
		let value = 1

		const count = {
			state: 0,
			effects: {
				add(payload: number): void {
					value += payload
				},
			},
			reducers: {},
		}

		const store = init({
			models: { count },
		})

		store.dispatch({ type: 'count/add', payload: 4 })

		expect(value).toBe(5)
	})

	test('second param should contain state', async () => {
		let secondParam = 0

		const count = {
			state: 7,
			reducers: {
				add: (s: number, p: number): number => s + p,
			},
			effects: {
				makeCall(_: number, state: any): void {
					secondParam = state
				},
			},
		}

		const store = init({
			models: { count },
		})

		store.dispatch.count.makeCall(2)

		expect(secondParam).toEqual({ count: 7 })
	})

	test('should create an effect dynamically', () => {
		const store = init()

		store.addModel({
			name: 'example',
			state: 0,
			effects: {
				add(this: any): void {
					this.addOne()
				},
			},
			reducers: {
				addOne: (): number => 1,
			},
		})

		store.dispatch({ type: 'example/add' })
		expect(store.getState().example).toBe(1)
	})

	test('should be able to trigger another action', async () => {
		type CountState = number
		type CountModel = {
			state: number
			reducers: {
				addOne(state: CountState): CountState
			}
			effects: {
				asyncAddOneArrow(): Promise<void>
			}
		}

		interface RootModel extends Models<RootModel> {
			example: CountModel
		}

		const example: CountModel = {
			state: 0,
			reducers: {
				addOne: (state: CountState): CountState => state + 1,
			},
			effects: {
				async asyncAddOneArrow(
					this: ModelDispatcher<CountModel, RootModel>
				): Promise<void> {
					await this.addOne()
				},
			},
		}

		const store = init({
			models: { example },
		})

		await store.dispatch.example.asyncAddOneArrow()

		expect(store.getState()).toEqual({
			example: 1,
		})
	})

	test('should be able trigger a local reducer using functions and `this`', async () => {
		type CountState = number
		type CountModel = {
			state: number
			reducers: {
				addOne(state: CountState): CountState
			}
			effects: {
				asyncAddOne(): Promise<void>
			}
		}

		interface RootModel extends Models<RootModel> {
			example: CountModel
		}

		const example: CountModel = {
			state: 0,
			reducers: {
				addOne: (state: CountState): CountState => state + 1,
			},
			effects: {
				async asyncAddOne(
					this: ModelDispatcher<CountModel, RootModel>
				): Promise<void> {
					await this.addOne()
				},
			},
		}

		const store = init({
			models: { example },
		})

		await store.dispatch.example.asyncAddOne()

		expect(store.getState()).toEqual({
			example: 1,
		})
	})

	test('should be able to trigger another action with a value', async () => {
		type CountState = number
		type CountModel = {
			state: number
			reducers: {
				addBy(state: CountState, payload: number): CountState
			}
			effects: {
				asyncAddBy(value: number): Promise<void>
			}
		}

		interface RootModel extends Models<RootModel> {
			example: CountModel
		}

		const example: CountModel = {
			state: 2,
			reducers: {
				addBy: (state: CountState, payload: number): CountState =>
					state + payload,
			},
			effects: {
				async asyncAddBy(
					this: ModelDispatcher<CountModel, RootModel>,
					value: number
				): Promise<void> {
					await this.addBy(value)
				},
			},
		}

		const store = init({
			models: { example },
		})

		await store.dispatch.example.asyncAddBy(5)

		expect(store.getState()).toEqual({
			example: 7,
		})
	})

	test('should be able to trigger another action w/ an object value', async () => {
		type CountState = number
		type CountModel = {
			state: number
			reducers: {
				addBy(state: CountState, payload: { value: number }): CountState
			}
			effects: {
				asyncAddBy(payload: { value: number }): Promise<void>
			}
		}

		interface RootModel extends Models<RootModel> {
			example: CountModel
		}

		const example: CountModel = {
			state: 3,
			reducers: {
				addBy: (state: CountState, payload: { value: number }): CountState =>
					state + payload.value,
			},
			effects: {
				async asyncAddBy(
					this: ModelDispatcher<CountModel, RootModel>,
					payload: { value: number }
				): Promise<void> {
					await this.addBy(payload)
				},
			},
		}

		const store = init({
			models: { example },
		})

		await store.dispatch.example.asyncAddBy({ value: 6 })

		expect(store.getState()).toEqual({
			example: 9,
		})
	})

	test('should be able to trigger another action w/ another action', async () => {
		type CountState = number
		type CountModel = {
			state: number
			reducers: {
				addOne(state: CountState): CountState
			}
			effects: {
				asyncAddOne(): Promise<void>
				asyncCallAddOne(): Promise<void>
			}
		}

		interface RootModel extends Models<RootModel> {
			example: CountModel
		}

		type EffectThis = ModelDispatcher<CountModel, RootModel>

		const example: CountModel = {
			state: 0,
			reducers: {
				addOne: (state: CountState): CountState => state + 1,
			},
			effects: {
				async asyncAddOne(this: EffectThis): Promise<void> {
					await this.addOne()
				},
				async asyncCallAddOne(this: EffectThis): Promise<void> {
					await this.asyncAddOne()
				},
			},
		}

		const store = init({
			models: { example },
		})

		await store.dispatch.example.asyncCallAddOne()

		expect(store.getState()).toEqual({
			example: 1,
		})
	})

	test('should be able to trigger another action w/ multiple actions', async () => {
		type CountState = number
		type CountModel = {
			state: number
			reducers: {
				addBy(state: CountState, payload: number): CountState
			}
			effects: {
				asyncAddOne(): Promise<void>
				asyncAddThree(): Promise<void>
				asyncAddSome(): Promise<void>
			}
		}
		interface RootModel extends Models<RootModel> {
			example: CountModel
		}
		type EffectThis = ModelDispatcher<CountModel, RootModel>

		const example: CountModel = {
			state: 0,
			reducers: {
				addBy: (state: CountState, payload: number): CountState =>
					state + payload,
			},
			effects: {
				async asyncAddOne(this: EffectThis): Promise<void> {
					await this.addBy(1)
				},
				async asyncAddThree(this: EffectThis): Promise<void> {
					await this.addBy(3)
				},
				async asyncAddSome(this: EffectThis): Promise<void> {
					await this.asyncAddThree()
					await this.asyncAddOne()
					await this.asyncAddOne()
				},
			},
		}

		const store = init({
			models: { example },
		})

		await store.dispatch.example.asyncAddSome()

		expect(store.getState()).toEqual({
			example: 5,
		})
	})

	test('should throw if the effect name is invalid', () => {
		const store = init()

		expect(() =>
			store.addModel({
				name: 'a',
				state: 42,
				effects: {
					'invalid/effect': (): number => 43,
				},
				reducers: {},
			})
		).toThrow()
	})

	test('should throw if the effect is not a function', () => {
		const store = init()

		expect(() =>
			store.addModel({
				name: 'a',
				state: 42,
				effects: {
					is43: 43,
				},
			} as any)
		).toThrow()
	})

	test('should appear as an action for devtools', async () => {
		const actions: string[] = []
		const middleware: Middleware = () => (next) => (action): any => {
			actions.push(action.type)
			return next(action)
		}

		type CountState = number
		type CountModel = {
			state: CountState
			reducers: {
				addOne(state: CountState): CountState
			}
			effects(
				dispatch: any
			): {
				addOneAsync(): void
			}
		}

		const count: CountModel = {
			state: 0,
			reducers: {
				addOne(state: CountState): CountState {
					return state + 1
				},
			},
			effects: (dispatch) => ({
				addOneAsync(): void {
					dispatch.count.addOne()
				},
			}),
		}

		const store = init({
			models: {
				count,
			},
			redux: {
				middlewares: [middleware],
			},
		})

		store.dispatch.count.addOneAsync()
		expect(actions).toEqual(['count/addOneAsync', 'count/addOne'])
	})

	test('should not validate effect if production', () => {
		process.env.NODE_ENV = 'production'

		const count = {
			state: 0,
			effects: {
				'add/invalid': (state: number): number => state + 1,
			},
			reducers: {},
		}

		expect(() =>
			init({
				models: { count },
			})
		).not.toThrow()
	})

	describe('effects as a function', () => {
		it('should pass dispatch in as a function', async () => {
			type CountState = number
			type CountModel = {
				state: CountState
				reducers: {
					addOne(state: CountState): CountState
				}
				effects(
					dispatch: any
				): {
					asyncAddOneArrow(): Promise<void>
				}
			}

			const example: CountModel = {
				state: 0,
				reducers: {
					addOne: (state: CountState): CountState => state + 1,
				},
				effects: (dispatch) => ({
					async asyncAddOneArrow(): Promise<void> {
						await dispatch.example.addOne()
					},
				}),
			}

			const store = init({
				models: { example },
			})

			await store.dispatch.example.asyncAddOneArrow()

			expect(store.getState()).toEqual({
				example: 1,
			})
		})
	})
})
