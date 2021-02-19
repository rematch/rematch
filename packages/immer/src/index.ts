import { Plugin, Models } from '@rematch/core'
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

const immerPlugin = <
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels> = Record<string, any>
>(
	config?: ImmerPluginConfig
): Plugin<TModels, TExtraModels> => ({
	onReducer(reducer: Redux.Reducer, model: string): Redux.Reducer | void {
		if (
			!config ||
			(!config.whitelist && !config.blacklist) ||
			(config.whitelist && config.whitelist.includes(model)) ||
			(config.blacklist && !config.blacklist.includes(model))
		) {
			return wrapReducerWithImmer(reducer)
		}

		return undefined
	},
})

export default immerPlugin
