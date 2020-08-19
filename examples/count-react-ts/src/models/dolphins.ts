import { createModel } from '@rematch/core'
import { delay } from './utils'
import { RootModel } from '.'

export type DolphinsState = number

export const dolphins = createModel<RootModel>()({
	state: 0,
	reducers: {
		increment: (state: DolphinsState, payload: number) => state + payload,
	},
	effects: (dispatch) => ({
		async incrementAsync(): Promise<void> {
			await delay(500)
			dispatch.dolphins.increment(1)
		},
	}),
})
