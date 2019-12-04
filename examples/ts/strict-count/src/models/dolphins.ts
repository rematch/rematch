import { Model } from '@rematch/core'
import { delay } from '../helpers'
import { RootDispatch } from '../store'

export type DolphinsState = number

const model: Model<DolphinsState> = {
	state: 0,
	reducers: {
		increment: (state: DolphinsState) => state + 1,
	},
	effects: (dispatch: RootDispatch) => ({
		async incrementAsync() {
			await delay(500)
			dispatch.dolphins.increment()
		},
	}),
}

export const dolphins: typeof model = model
