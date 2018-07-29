import { Models, Plugin } from '@rematch/core'
import produce from 'immer'
import { combineReducers, ReducersMapObject } from 'redux'

function combineReducersWithImmer(reducers: ReducersMapObject) {
	const reducersWithImmer = {}

	// reducer must return value because literal don't support immer
	for (const [key, reducerFn] of Object.entries(reducers)) {
		reducersWithImmer[key] = (state, payload) => {
			if (typeof state === 'object') {
				return produce(state, (draft: Models) => reducerFn(draft, payload))
			} else {
				return reducerFn(state, payload)
			}
		}
	}

	return combineReducers(reducersWithImmer)
}

// rematch plugin
const immerPlugin = (): Plugin => ({
	config: {
		redux: {
			combineReducers: combineReducersWithImmer,
		},
	},
})

export default immerPlugin
