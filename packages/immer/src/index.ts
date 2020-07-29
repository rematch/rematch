import { Plugin } from '@rematch/core'
import produce from 'immer'
import Redux from 'redux'

export type ImmerPluginConfig = {
	whitelist?: string[]
	blacklist?: string[]
}

function wrapReducerWithImmer(reducer: Redux.Reducer) {
	// reducer must return value because literal don't support immer
	return (state: any, payload: any): any =>
		typeof state === 'object'
			? produce(state, (draft: any) => {
					const next = reducer(draft, payload)
					if (typeof next === 'object') return next
					return undefined
			  })
			: reducer(state, payload)
}

const immerPlugin = (config?: ImmerPluginConfig): Plugin => ({
	onReducer(reducer: Redux.Reducer, model: string): Redux.Reducer | void {
		if (
			!config ||
			(!config.whitelist && !config.blacklist) ||
			(config.whitelist && model in config.whitelist) ||
			(config.blacklist && !(model in config.blacklist))
		) {
			return wrapReducerWithImmer(reducer)
		}

		return undefined
	},
})

export default immerPlugin
