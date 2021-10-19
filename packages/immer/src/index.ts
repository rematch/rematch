import { Plugin, Models } from '@rematch/core'
import produce from 'immer'
import Redux from 'redux'

export type ImmerPluginConfig = {
	whitelist?: string[]
	blacklist?: string[]
}

function wrapReducerWithImmer(reducer: Redux.Reducer) {
	return (state: any, payload: any): any => {
		if (state === undefined) return reducer(state, payload)
		return produce(state, (draft: any) => reducer(draft, payload))
	}
}

const immerPlugin = <
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels> = Record<string, never>
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
