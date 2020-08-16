import { createModel } from '@rematch/core'
import { Dispatch } from '../store'
import { delay } from './utils'

export type DolphinsState = number

	export const dolphins = createModel<DolphinsState>()({
		state: 0,
		reducers: {
			increment: (state, payload: number) => state + payload,
		},
		effects: (dispatch) => ({
			async incrementAsync(): Promise<void> {
				const typedDispatch = dispatch as Dispatch
				await delay(500)
				typedDispatch.dolphins.increment(1);
			},
		}),
	})
