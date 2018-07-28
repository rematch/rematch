import { Models, Plugin } from '@rematch/core'
import produce from 'immer'
import { combineReducers, ReducersMapObject } from 'redux'

export interface ImmerConfig {
	whitelist?: string[];
	blacklist?: string[];
}

const validateConfig = config => {
	if (config.whitelist && !Array.isArray(config.whitelist)) {
		throw new Error('immer plugin config whitelist must be an array of strings')
	}
	if (config.blacklist && !Array.isArray(config.blacklist)) {
		throw new Error('immer plugin config blacklist must be an array of strings')
	}
	if (config.whitelist && config.blacklist) {
		throw new Error(
			'immer plugin config cannot have both a whitelist & a blacklist'
		)
	}
}

function getCombineReducersWithImmer(config: ImmerConfig) {
	return (reducers: ReducersMapObject) => {
		const reducersWithImmer = {}

		// reducer must return value because literal don't support immer
		for (const [key, reducerFn] of Object.entries(reducers)) {
			// ignore reducers not in whitelist
			if (config.whitelist && !config.whitelist.includes(key)) {
				continue
			}
			// ignore reducers in blacklist
			if (config.blacklist && config.blacklist.includes(key)) {
				continue
			}
			reducersWithImmer[key] = (state, payload) => {
				if (typeof state === 'object') {
					return produce(state, (draft: Models) => {
						reducerFn(draft, payload)
					})
				} else {
					return reducerFn(state, payload)
				}
			}
		}

		return combineReducers(reducersWithImmer)
	}
}

// rematch plugin
export default (config: ImmerConfig = {}): Plugin => {
	validateConfig(config)
	return {
		config: {
			redux: {
				combineReducers: getCombineReducersWithImmer(config),
			},
		},
	}
}
