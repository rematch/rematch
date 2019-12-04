import * as Redux from 'redux'
import * as R from '../typings'
import { validateConfig } from './validate'

const merge = <T extends object>(
	original: T | undefined,
	next: T | undefined
): T | object => {
	return next ? { ...next, ...(original || {}) } : original || {}
}

/**
 * mergeConfig
 *
 * merge init configs together
 */
export default (initConfig: R.InitConfig & { name: string }): R.Config => {
	const config: R.Config = {
		name: initConfig.name,
		models: {},
		plugins: [],
		...initConfig,
		redux: {
			reducers: {},
			rootReducers: {},
			enhancers: [],
			middlewares: [],
			...initConfig.redux,
			devtoolOptions: {
				name: initConfig.name,
				...(initConfig.redux && initConfig.redux.devtoolOptions
					? initConfig.redux.devtoolOptions
					: {}),
			},
		},
	}

	validateConfig(config)

	// defaults
	for (const plugin of config.plugins) {
		if (plugin.config) {
			// models
			config.models = merge(config.models, plugin.config.models) as R.Models

			// plugins
			config.plugins = [...config.plugins, ...(plugin.config.plugins || [])]

			// redux
			if (plugin.config.redux) {
				config.redux.initialState = merge(
					config.redux.initialState,
					plugin.config.redux.initialState
				)

				config.redux.reducers = merge(
					config.redux.reducers,
					plugin.config.redux.reducers
				) as R.ModelReducers

				config.redux.rootReducers = merge(
					config.redux.rootReducers,
					plugin.config.redux.reducers
				) as Redux.ReducersMapObject

				config.redux.enhancers = [
					...config.redux.enhancers,
					...(plugin.config.redux.enhancers || []),
				]

				config.redux.middlewares = [
					...config.redux.middlewares,
					...(plugin.config.redux.middlewares || []),
				]

				config.redux.combineReducers =
					config.redux.combineReducers || plugin.config.redux.combineReducers

				config.redux.createStore =
					config.redux.createStore || plugin.config.redux.createStore
			}
		}
	}
	return config
}
