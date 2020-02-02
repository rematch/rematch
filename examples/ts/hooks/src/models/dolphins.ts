import { delay } from '../helpers'
import { Dispatch } from '../store'

export type DolphinsState = number

export const dolphins = {
	state: 0,
	reducers: {
		increment: (state: DolphinsState) => state + 1,
	},
	effects: (dispatch: Dispatch) => ({
		async incrementAsync() {
			await delay(500)
			dispatch.dolphins.increment()
		},
	}),
}
