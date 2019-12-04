/* eslint-disable consistent-return,@typescript-eslint/no-explicit-any */
import { Plugin, ReduxReducer } from '@rematch/core'
import produce from 'immer'

export type ImmerPluginConfig = {
	whitelist?: string[]
	blacklist?: string[]
}

function wrapReducerWithImmer(reducer: ReduxReducer) {
	// reducer must return value because literal don't support immer
	return (state: any, payload: any): any =>
		typeof state === 'object'
			? produce(state, draft => {
					const next = reducer(draft, payload)
					if (typeof next === 'object') return next
			  })
			: reducer(state, payload)
}

const immerPlugin = (config?: ImmerPluginConfig): Plugin => ({
	onReducer(reducer: ReduxReducer, model: string): ReduxReducer | void {
		if (
			!config ||
			(!config.whitelist && !config.blacklist) ||
			(config.whitelist && model in config.whitelist) ||
			(config.blacklist && !(model in config.blacklist))
		) {
			return wrapReducerWithImmer(reducer)
		}
	},
})

export default immerPlugin
