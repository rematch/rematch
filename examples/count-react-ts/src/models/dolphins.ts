import { createModel } from '@rematch/core'
import { delay } from './utils'
import type { RootModel } from '.'

export type DolphinsState = number

export const dolphins = createModel<RootModel>()({
	state: 0,
	reducers: {
		increment: (state: DolphinsState, payload: number) => state + payload,
	},
	effects: (dispatch) => {
		const { dolphins } = dispatch
		return {
			async incrementAsync(): Promise<void> {
				await delay(500)
				dolphins.increment(1)
			},
		}
	},
})
