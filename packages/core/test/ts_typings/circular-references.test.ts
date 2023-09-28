import { createModel, Models } from '../../src'

describe('circular references', () => {
	it("shouldn't throw error accessing rootState in effects with a return value", () => {
		type ComplexTypeIds = {
			[key: string]: boolean
		}
		type ComplexType = {
			ids: ComplexTypeIds
		}
		const model = createModel<RootModel>()({
			state: {
				ids: {},
			} as ComplexType,
			effects: () => ({
				async a(
					payload: { name: string },
					rootState
					// the key is defining the Promise<boolean>
				): Promise<boolean> {
					const { myModel } = rootState
					const id = myModel.ids[payload.name]
					return id
				},
			}),
		})
		// @ts-expect-error
		const otherModel = createModel<RootModel>()({
			state: {
				ids: {},
			} as ComplexType,
			effects: () => ({
				async b(payload: { name: string }, rootState) {
					// @ts-expect-error
					const { otherModel } = rootState
					// @ts-expect-error
					const id = otherModel.ids[payload.name]
					return id
				},
			}),
		})

		interface RootModel extends Models<RootModel> {
			myModel: typeof model
			// @ts-expect-error
			otherModel: typeof otherModel
		}
	})
	it("shouldn't throw an error if you want to extend a model", () => {
		const base = createModel<RootModel>()({
			state: { foo: false },
			reducers: {
				setFoo(state, value) {
					return {
						...state,
						foo: value,
					}
				},
			},
			// the dispatch parameter triggers: "Type of property 'base' circularly references itself in mapped type 'ExtractRematchDispatchersFromModels<ExtendedModel>'"
			// if you type this to any, the circular dependency is interrupted but why does this not work?
			effects: (dispatch) => ({
				async setFooAsync(_, rootState): Promise<boolean> {
					dispatch.base.setFoo(true)
					return rootState.base.foo
				},
			}),
		})
		interface RootModel extends Models<RootModel> {
			base: typeof base
		}
		const extension = createModel<ExtendedModel>()({
			state: { bar: false } as { bar: boolean },
			reducers: {
				setBar(state, value: boolean) {
					return {
						...state,
						bar: value,
					}
				},
			},
			effects: (dispatch) => ({
				async setBarAsync(_, rootState): Promise<boolean> {
					dispatch.extension.setBar(true)
					return rootState.extension.bar
				},
			}),
		})
		interface ExtendedModel extends Models<ExtendedModel> {
			base: typeof base
			extension: typeof extension
		}
	})
})
