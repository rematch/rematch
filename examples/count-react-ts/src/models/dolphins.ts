import { createModel } from '@rematch/core'
import { Dispatch } from '../store'
import { delay } from './utils'

export type DolphinsState = number

export const dolphins = {
	state: 0,
	reducers: {
		increment: (state: DolphinsState, payload: number) => state + payload,
	},
	effects: (dispatch: Dispatch) => ({
		async incrementAsync(): Promise<void> {
			const typedDispatch = dispatch as Dispatch
			await delay(500)
			typedDispatch.dolphins.increment(1)
		},
	}),
}
