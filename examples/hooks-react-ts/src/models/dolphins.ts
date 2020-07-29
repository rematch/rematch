import { createModel } from '@rematch/core'
import { delay } from './utils'
import { Dispatch } from '../store'

type DolphinsState = number

export const dolphins = createModel<DolphinsState>()({
	state: 0,
	reducers: {
		increment: (state) => state + 1,
	},
	effects: (dispatch) => ({
		async incrementAsync(): Promise<void> {
			const typedDispatch = dispatch as Dispatch
			await delay(500)
			typedDispatch.dolphins.increment()
		},
	}),
});
