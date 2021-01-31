import { createModel } from '@rematch/core'
import { delay } from './utils'
import { RootModel } from '.'

export const dolphins = createModel<RootModel>()({
	state: 0,
	reducers: {
		increment: (state, payload: number = 1) => state + payload,
	},
	effects: (dispatch) => ({
		async incrementAsync() {
			await delay(500)
			dispatch.dolphins.increment()
		},
	}),
})
