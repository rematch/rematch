import { InitConfig, Config, Models, ConfigRedux, Plugin } from './types'
import { validateConfig, validatePlugin } from './validate'

let count = 0

type KeysOfConfig<K extends keyof ConfigRedux> = Array<
	keyof Pick<ConfigRedux, K>
>

/**
 * Builds complete Rematch config using default values for properties not
 * supplied by the user. Additionally, applies changes to the config made by
 * the plugins selected by the user.
 */
export default function createConfig<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = Record<string, any>
>(
	initConfig: InitConfig<TModels, TExtraModels>
): Config<TModels, TExtraModels> {
	const storeName = initConfig.name ?? `Rematch Store ${count}`

	count += 1

	const config: Config<TModels, TExtraModels> = {
		name: storeName,
		models: initConfig.models || ({} as TModels),
		plugins: initConfig.plugins || ([] as Plugin<TModels, TExtraModels>[]),
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
	}

	validateConfig(config)

	// Apply changes to the config required by plugins
	config.plugins.forEach((plugin) => {
		if (plugin.config) {
			// Collect new models
			config.models = merge(config.models, plugin.config.models as any)

			// Collect redux configuration changes
			if (plugin.config.redux) {
				;(['initialState', 'reducers', 'rootReducers'] as KeysOfConfig<
					'reducers' | 'initialState' | 'rootReducers'
				>).forEach((r) => {
					config.redux[r] = merge(config.redux[r], plugin.config?.redux?.[r])
				})
				;(['enhancers', 'middlewares'] as KeysOfConfig<
					'enhancers' | 'middlewares'
				>).forEach((m) => {
					config.redux[m] = [
						...config.redux[m],
						...(plugin.config?.redux?.[m] || ([] as any)),
					]
				})

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
function merge<T extends Record<string, any>>(
	original: T,
	extra: T | undefined
): T {
	return extra ? { ...extra, ...original } : original
}
