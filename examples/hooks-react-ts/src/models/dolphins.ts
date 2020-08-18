import { createModel } from '@rematch/core'
import { delay } from './utils'
import { RootModel } from '.';

export const dolphins = createModel<RootModel>()({
	state: 0,
	reducers: {
		increment: (state) => state + 1,
	},
	effects: (dispatch) => ({
		async incrementAsync() {
			await delay(500)
			dispatch.dolphins.increment()
		},
	}),
});
