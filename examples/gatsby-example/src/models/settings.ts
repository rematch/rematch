import { createModel } from "@rematch/core"
import { RootModel } from "."

export const settings = createModel<RootModel>()({
	state: {
		isDarkModeEnabled: false,
	},
	reducers: {
		tg(state) {
			return {
				isDarkModeEnabled: !state.isDarkModeEnabled,
			}
		},
	},
	effects: dispatch => ({
		toggleDarkThemeEffect() {
			dispatch.settings.tg()
		},
	}),
})
