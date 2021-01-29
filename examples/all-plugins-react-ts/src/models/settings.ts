import { createModel } from '@rematch/core'
import { RootModel } from '.'

export const settings = createModel<RootModel>()({
	state: {
		isLightThemeOn: true,
	},
	reducers: {
		SET_THEME: (state, payload: 'light' | 'dark') => {
			state.isLightThemeOn = payload
				? payload === 'light'
				: !state.isLightThemeOn
			return state
		},
	},
})
