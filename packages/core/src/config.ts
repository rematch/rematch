import { InitConfig, Config, Models, ConfigRedux } from './types'
import { validateConfig, validatePlugin } from './validate'

let count = 0

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
	} as Config

	if (process.env.NODE_ENV !== 'production') {
		validateConfig(config)
	}

	// Apply changes to the config required by plugins
	config.plugins.forEach((plugin) => {
		if (plugin.config) {
			// Collect new models
			config.models = merge(config.models, plugin.config.models)

			type ConfigReduxKeys = keyof ConfigRedux

			// Collect redux configuration changes
			// we use the non-nullish assertion because typecript complains about probability of nullish values
			// to win some bundlesize we avoid this recommendation of checking on every foreach if the value is nullish
			// because it's already checked in the upper scope and isn't necessary giving the context.
			if (plugin.config.redux) {
				;([
					'initialState',
					'reducers',
					'rootReducers',
				] as Array<ConfigReduxKeys>).forEach((e) => {
					config.redux[e] = merge(config.redux[e], plugin!.config!.redux![e])
				})
				;(['middlewares', 'enhancers'] as Array<ConfigReduxKeys>).forEach(
					(e) => {
						config.redux[e] = [
							...config.redux[e],
							...(plugin!.config!.redux![e] || []),
						]
					}
				)
				;(['combineReducers', 'createStore'] as Array<ConfigReduxKeys>).forEach(
					(e) => {
						config.redux[e] = config.redux[e] || plugin!.config!.redux![e]
					}
				)
			}
		}

		if (process.env.NODE_ENV !== 'production') {
			validatePlugin(plugin)
		}
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
