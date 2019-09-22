import { Models, Plugin } from '@rematch/core'
import produce from 'immer'
import { combineReducers, ReducersMapObject } from 'redux'

function combineReducersWithImmer(reducers: ReducersMapObject) {
	const reducersWithImmer = {}
	// reducer must return value because literal don't support immer
	for (const key of Object.keys(reducers)) {
		const reducerFn = reducers[key]
		reducersWithImmer[key] = (state, payload) => {
			if (typeof state === 'object') {
				return produce(state, (draft: Models) => {
					const next = reducerFn(draft, payload)
					if (typeof next === 'object') {
						return next
					}
				})
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
