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
})
