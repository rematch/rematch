import { createModel } from '@rematch/core'
import { Dispatch } from '../store'
import { delay } from './utils'
import { RootModel } from '.'

export type DolphinsState = number

// export const dolphins = createModel<RootModel>()({
// 	state: 0,
// 	reducers: {
// 		increment: (state, payload: number) => state + payload,
// 	},
// 	effects: (dispatch) => ({
// 		async incrementAsync(): Promise<void> {
// 			await delay(500)
// 			dispatch.dolphins.increment(1)
// 		},
// 	}),
// })

export const dolphins = {
	state: 0,
	reducers: {
		increment: (state: DolphinsState, payload: number) => state + payload,
	},
	effects: (dispatch: Dispatch) => ({
		async incrementAsync(): Promise<void> {
			await delay(500)
			dispatch.dolphins.increment(1)
		},
	}),
}
