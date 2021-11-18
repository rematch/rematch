import { createModel, init, Models } from '../../src'

describe('Dispatcher typings', () => {
	describe("shouldn't throw error accessing reducers with", () => {
		it('required payload', () => {
			const model = createModel<RootModel>()({
				state: 0,
				reducers: {
					inc(state, payload: number) {
						return state + payload
					},
				},
			})
			interface RootModel extends Models<RootModel> {
				myModel: typeof model
			}

			const store = init({ models: { myModel: model } })

			const { dispatch } = store
			dispatch.myModel.inc(1)
			// @ts-expect-error
			dispatch.myModel.inc()
		})

		it('custom types', () => {
			type Themes = 'light' | 'dark'
			const model = createModel<RootModel>()({
				state: 'light',
				reducers: {
					inc(state, payload: Themes) {
						return payload ?? state
					},
				},
			})
			interface RootModel extends Models<RootModel> {
				myModel: typeof model
			}

			const store = init({ models: { myModel: model } })

			const { dispatch } = store
			dispatch.myModel.inc('light')
			dispatch.myModel.inc('dark')
			// @ts-expect-error
			dispatch.myModel.inc('other')
			// @ts-expect-error
			dispatch.myModel.inc()
		})

		it('with union types', () => {
			const model = createModel<RootModel>()({
				state: 'light',
				reducers: {
					inc(state, payload: 'light' | 'dark') {
						return payload ?? state
					},
				},
			})
			interface RootModel extends Models<RootModel> {
				myModel: typeof model
			}

			const store = init({ models: { myModel: model } })

			const { dispatch } = store
			dispatch.myModel.inc('light')
			dispatch.myModel.inc('dark')
			// @ts-expect-error
			dispatch.myModel.inc('other')
			// @ts-expect-error
			dispatch.myModel.inc()
		})

		it('optional payload', () => {
			const model = createModel<RootModel>()({
				state: 0,
				reducers: {
					inc(state, payload?: number) {
						return state + (payload ?? 0)
					},
				},
			})
			interface RootModel extends Models<RootModel> {
				myModel: typeof model
			}

			const store = init({ models: { myModel: model } })

			const { dispatch } = store
			dispatch.myModel.inc(1)
			dispatch.myModel.inc()
		})

		it('optional payload with default value when nil', () => {
			const model = createModel<RootModel>()({
				state: 0,
				reducers: {
					// eslint-disable-next-line @typescript-eslint/no-inferrable-types
					inc(state, payload: number = 3) {
						return state + payload
					},
				},
			})
			interface RootModel extends Models<RootModel> {
				myModel: typeof model
			}

			const store = init({ models: { myModel: model } })

			const { dispatch } = store
			dispatch.myModel.inc(4)
			dispatch.myModel.inc()
		})

		it('payload defined as any type', () => {
			const model = createModel<RootModel>()({
				state: 0,
				reducers: {
					inc(state, payload: any) {
						return state + payload
					},
				},
			})
			interface RootModel extends Models<RootModel> {
				myModel: typeof model
			}

			const store = init({ models: { myModel: model } })

			const { dispatch } = store
			dispatch.myModel.inc(4)
			dispatch.myModel.inc('4')
			// @ts-expect-error
			dispatch.myModel.inc()
		})

		it('optional payload defined as any type', () => {
			const model = createModel<RootModel>()({
				state: 0,
				reducers: {
					inc(state, payload?: any) {
						return state + payload
					},
				},
			})
			interface RootModel extends Models<RootModel> {
				myModel: typeof model
			}

			const store = init({ models: { myModel: model } })

			const { dispatch } = store
			dispatch.myModel.inc(4)
			dispatch.myModel.inc('4')
			dispatch.myModel.inc()
		})

		it('required payload but maybe undefined', () => {
			const model = createModel<RootModel>()({
				state: 0,
				reducers: {
					inc(state, payload: number | undefined) {
						return state + (payload || 1)
					},
				},
			})
			interface RootModel extends Models<RootModel> {
				myModel: typeof model
			}

			const store = init({ models: { myModel: model } })

			const { dispatch } = store
			dispatch.myModel.inc(4)
			dispatch.myModel.inc(undefined)
			// @ts-expect-error
			dispatch.myModel.inc()
		})

		it('payload and meta', () => {
			const model = createModel<RootModel>()({
				state: 0,
				reducers: {
					incWithRequiredMeta(state, payload: number, _meta: string) {
						return state + (payload || 1)
					},
					incWithOptionalMeta(state, payload: number, _meta?: string) {
						return state + (payload || 1)
					},
					incWithOptionalMetaAndOptionalPayload(
						state,
						payload?: number,
						_meta?: string
					) {
						return state + (payload || 1)
					},
				},
			})
			interface RootModel extends Models<RootModel> {
				myModel: typeof model
			}

			const store = init({ models: { myModel: model } })
			const { dispatch } = store

			dispatch.myModel.incWithRequiredMeta(4, '4')
			// @ts-expect-error
			dispatch.myModel.incWithRequiredMeta(4)

			dispatch.myModel.incWithOptionalMeta(4, '4')
			dispatch.myModel.incWithOptionalMeta(4)

			dispatch.myModel.incWithOptionalMetaAndOptionalPayload()
			dispatch.myModel.incWithOptionalMetaAndOptionalPayload(4)
			dispatch.myModel.incWithOptionalMetaAndOptionalPayload(4, '4')
		})

		it('reducer without arguments', () => {
			const model = createModel<RootModel>()({
				state: 0,
				reducers: {
					inc(state) {
						return state
					},
				},
			})
			interface RootModel extends Models<RootModel> {
				myModel: typeof model
			}

			const store = init({ models: { myModel: model } })

			const { dispatch } = store
			dispatch.myModel.inc()
			// @ts-expect-error
			dispatch.myModel.inc(1)
		})
	})

	describe("shouldn't throw error accessing effects with", () => {
		it('required payload', () => {
			const count = createModel<RootModel>()({
				state: 0, // initial state
				effects: () => ({
					incrementEffect(payload: number) {
						return payload
					},
					incWithPayloadMaybeUndefined(payload: number | undefined) {
						return payload
					},
				}),
			})
			interface RootModel extends Models<RootModel> {
				count: typeof count
			}

			const store = init<RootModel>({ models: { count } })
			const { dispatch } = store

			// @ts-expect-error
			dispatch.count.incrementEffect()
			// @ts-expect-error
			dispatch.count.incWithPayloadMaybeUndefined()
			dispatch.count.incWithPayloadMaybeUndefined(undefined)
			// @ts-expect-error
			dispatch.count.incrementEffect('test')
			dispatch.count.incrementEffect(2)
		})

		it('optional payload', () => {
			const count = createModel<RootModel>()({
				state: 0, // initial state
				effects: () => ({
					incrementEffect(payload?: number) {
						return payload
					},
				}),
			})
			interface RootModel extends Models<RootModel> {
				count: typeof count
			}

			const store = init<RootModel>({ models: { count } })
			const { dispatch } = store

			dispatch.count.incrementEffect(2)
			dispatch.count.incrementEffect()
			// @ts-expect-error
			dispatch.count.incrementEffect('test')
		})

		it('required payload and accessing rootState', () => {
			const count = createModel<RootModel>()({
				state: 0, // initial state
				effects: () => ({
					incrementEffect(payload: number, rootState) {
						if (rootState.count) {
							// do nothing
						}
						return payload
					},
				}),
			})
			interface RootModel extends Models<RootModel> {
				count: typeof count
			}

			const store = init<RootModel>({ models: { count } })
			const { dispatch } = store

			// @ts-expect-error
			dispatch.count.incrementEffect()
			// @ts-expect-error
			dispatch.count.incrementEffect('test')
			dispatch.count.incrementEffect(2)
		})

		it('optional payload and accessing rootState', () => {
			const count = createModel<RootModel>()({
				state: 0, // initial state
				effects: () => ({
					incrementEffect(payload?: number, rootState?): number | undefined {
						if (rootState.count) {
							// do nothing
						}
						return payload
					},
				}),
			})
			interface RootModel extends Models<RootModel> {
				count: typeof count
			}

			const store = init<RootModel>({ models: { count } })
			const { dispatch } = store

			dispatch.count.incrementEffect(2)
			dispatch.count.incrementEffect()
			// @ts-expect-error
			dispatch.count.incrementEffect('test', { prueba: 'hola ' })
		})

		it('payload and meta', () => {
			const model = createModel<RootModel>()({
				state: 0,
				effects: {
					// eslint-disable-next-line @typescript-eslint/no-empty-function
					incWithRequiredMeta(_payload: number, _rootState, _meta: string) {},
					// eslint-disable-next-line @typescript-eslint/no-empty-function
					incWithOptionalMeta(_payload: number, _rootState, _meta?: string) {},
					incWithOptionalMetaAndOptionalPayload(
						_payload?: number,
						_rootState?,
						_meta?: string
						// eslint-disable-next-line @typescript-eslint/no-empty-function
					) {},
					incWithMetaMaybeUndefined(
						_payload: number,
						_rootState,
						_meta: string | undefined
						// eslint-disable-next-line @typescript-eslint/no-empty-function
					) {},
				},
			})
			interface RootModel extends Models<RootModel> {
				myModel: typeof model
			}

			const store = init({ models: { myModel: model } })
			const { dispatch } = store

			dispatch.myModel.incWithRequiredMeta(4, '4')
			// @ts-expect-error
			dispatch.myModel.incWithRequiredMeta(4)

			dispatch.myModel.incWithOptionalMeta(4, '4')
			dispatch.myModel.incWithOptionalMeta(4)

			dispatch.myModel.incWithOptionalMetaAndOptionalPayload()
			dispatch.myModel.incWithOptionalMetaAndOptionalPayload(4)
			dispatch.myModel.incWithOptionalMetaAndOptionalPayload(4, '4')

			// @ts-expect-error
			dispatch.myModel.incWithMetaMaybeUndefined(4)
			dispatch.myModel.incWithMetaMaybeUndefined(4, undefined)
		})

		it('without any parameter', () => {
			const model = createModel<RootModel>()({
				state: 0,
				effects: {
					// eslint-disable-next-line @typescript-eslint/no-empty-function
					withoutArgs() {},
				},
			})
			interface RootModel extends Models<RootModel> {
				myModel: typeof model
			}

			const store = init({ models: { myModel: model } })
			const { dispatch } = store

			dispatch.myModel.withoutArgs()
			// @ts-expect-error
			dispatch.myModel.withoutArgs(1)
			// @ts-expect-error
			dispatch.myModel.withoutArgs(1, 2)
			// @ts-expect-error
			dispatch.myModel.withoutArgs({ '1': 1 })
		})
	})

	describe('should throw error while accessing non-existent reducer/effects', () => {
		interface RootModel extends Models<RootModel> {
			count: typeof count
		}

		const count = createModel<RootModel>()({
			state: 0,
			reducers: {
				increment(state, payload: number) {
					return state + payload
				},
			},
			effects: (_dispatch) => ({
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				decrement(_: number, _state) {},
			}),
		})

		const store = init<RootModel>({
			models: {
				count,
			},
		})

		try {
			// @ts-expect-error
			store.dispatch.count.foo()
		} catch (error: any) {
			// catch because .foo() doesn't exist
		}
	})

	describe('dispatch to an effect with the same name of the reducer', () => {
		interface RootModel extends Models<RootModel> {
			count: typeof count
		}

		const count = createModel<RootModel>()({
			state: 0,
			reducers: {
				increment(state, payload: number) {
					return state + payload
				},
				decrement(state, payload: number) {
					return state - payload
				},
			},
			effects: (dispatch) => ({
				increment(_: number, state) {
					if (state.count < 5) {
						dispatch.count.increment(1)
					}
				},
			}),
		})

		const store = init<RootModel>({
			models: {
				count,
			},
		})

		store.dispatch.count.increment(1)
		store.dispatch.count.increment(10)
		// @ts-expect-error because increment payload:number, not string
		store.dispatch.count.increment('10')
		store.dispatch.count.decrement(3)
		// @ts-expect-error because increment payload:number, not string
		store.dispatch.count.decrement('10')
	})
})
