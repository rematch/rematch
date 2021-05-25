import { createModel, init, Models, RematchDispatch } from '../../src'

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

			const dispatch = store.dispatch as RematchDispatch<RootModel>
			dispatch.myModel.inc(1)
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

			const dispatch = store.dispatch as RematchDispatch<RootModel>
			dispatch.myModel.inc(1)
			dispatch.myModel.inc()
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
				}),
			})
			interface RootModel extends Models<RootModel> {
				count: typeof count
			}

			const store = init<RootModel>({ models: { count } })
			const dispatch = store.dispatch as RematchDispatch<RootModel>

			// @ts-expect-error
			dispatch.count.incrementEffect()
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
	})

	describe("shouldn't throw error accessing effects with", () => {
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
			const dispatch = store.dispatch as RematchDispatch<RootModel>

			// @ts-expect-error
			dispatch.count.incrementEffect()
			// @ts-expect-error
			dispatch.count.incrementEffect('test')
			dispatch.count.incrementEffect(2)
		})
		it('optional payload  and accessing rootState', () => {
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
			const dispatch = store.dispatch as RematchDispatch<RootModel>

			dispatch.count.incrementEffect(2)
			dispatch.count.incrementEffect()
			// @ts-expect-error
			dispatch.count.incrementEffect('test', { prueba: 'hola ' })
		})
	})
})
