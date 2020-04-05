import { Dispatch } from '../store'
import { delay } from './utils'

export type DolphinsState = number

export const dolphins = {
	state: 0,
	reducers: {
		increment: (state: DolphinsState): DolphinsState => state + 1,
	},
	effects: (dispatch: Dispatch) => ({
		async incrementAsync(): Promise<void> {
			await delay(500)
			dispatch.dolphins.increment()
		},
	}),
}
