import { InitConfig, Config, Models } from './types'
import { validateConfig, validatePlugin } from './validate'

let count = 0

/**
 * Builds complete Rematch config using default values for properties not
 * supplied by the user. Additionally, applies changes to the config made by
 * the plugins selected by the user.
 */
export default function createConfig<
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>
>(
	initConfig: InitConfig<TModels, TExtraModels>
): Config<TModels, TExtraModels> {
	const storeName = initConfig.name ?? `Rematch Store ${count}`

	count += 1

	const config = {
		name: storeName,
		models: initConfig.models || {},
		plugins: initConfig.plugins || [],
		redux: {
			reducers: {},
			rootReducers: {},
			enhancers: [],
			middlewares: [],
			...initConfig.redux,
			devtoolOptions: {
				name: storeName,
				...(initConfig.redux?.devtoolOptions ?? {}),
			},
		},
	} as Config<TModels, TExtraModels>

	validateConfig(config)

	// Apply changes to the config required by plugins
	config.plugins.forEach((plugin) => {
		if (plugin.config) {
			// Collect new models
			config.models = merge(config.models, plugin.config.models)

			// Collect redux configuration changes
			if (plugin.config.redux) {
				config.redux.initialState = merge(
					config.redux.initialState,
					plugin.config.redux.initialState
				)

				config.redux.reducers = merge(
					config.redux.reducers,
					plugin.config.redux.reducers
				)

				config.redux.rootReducers = merge(
					config.redux.rootReducers,
					plugin.config.redux.reducers
				)

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

		validatePlugin(plugin)
	})

	return config as Config<TModels, TExtraModels>
}

/**
 * Shallow merges original object with the extra object, giving the precedence
 * to the original object.
 */
function merge<
	T extends Record<string, unknown>,
	U extends Record<string, unknown> = T
>(original: T, extra?: U): T | (T & U) {
	return extra ? { ...extra, ...original } : original
}
