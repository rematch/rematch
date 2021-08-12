import {
	ExtractRematchDispatchersFromEffects,
	Plugin,
	Models,
	Reducer,
	NamedModel,
	Action,
} from '@rematch/core'

export type LoadingPluginType = 'number' | 'boolean' | 'full'
export interface LoadingConfig {
	name?: string
	whitelist?: string[]
	blacklist?: string[]
	type?: LoadingPluginType
	/**
	 * @deprecated Use `type: 'number'` instead
	 */
	asNumber?: boolean
}
type PickLoadingPluginType<
	WhichType extends LoadingPluginType
> = WhichType extends 'number'
	? number
	: WhichType extends 'full'
	? DetailedPayload
	: boolean

interface LoadingStateV2<
	TModels extends Models<TModels>,
	WhichType extends LoadingPluginType
> {
	global: PickLoadingPluginType<WhichType>
	models: {
		[modelName in keyof TModels]: PickLoadingPluginType<WhichType>
	}
	effects: {
		[modelName in keyof TModels]: {
			[effectName in keyof ExtractRematchDispatchersFromEffects<
				TModels[modelName]['effects'],
				TModels
			>]: PickLoadingPluginType<WhichType>
		}
	}
}

interface InitialStateV2<WhichType extends LoadingPluginType> {
	global: PickLoadingPluginType<WhichType>
	models: {
		[modelName: string]: PickLoadingPluginType<WhichType>
	}
	effects: {
		[modelName: string]: {
			[effectName: string]: PickLoadingPluginType<WhichType>
		}
	}
}

type Converter<WhichType extends LoadingPluginType> = (
	cnt: number,
	detailedPayload?: DetailedPayload
) => PickLoadingPluginType<WhichType>

interface LoadingModelV2<
	TModels extends Models<TModels>,
	WhichType extends LoadingPluginType
> extends NamedModel<TModels, LoadingStateV2<TModels, WhichType>> {
	reducers: {
		hide: Reducer<LoadingStateV2<TModels, WhichType>>
		show: Reducer<LoadingStateV2<TModels, WhichType>>
	}
}

export interface ExtraModelsFromLoading<
	TModels extends Models<TModels>,
	TConfig extends LoadingConfig = {
		type: 'boolean'
	}
> extends Models<TModels> {
	loading: LoadingModelV2<
		TModels,
		TConfig['type'] extends LoadingPluginType ? TConfig['type'] : 'boolean'
	>
}

type DetailedPayload = {
	error: unknown
	success: boolean
	loading?: boolean
}

const createLoadingAction = <
	TModels extends Models<TModels>,
	WhichType extends LoadingPluginType
>(
	converter: Converter<WhichType>,
	i: number,
	cntState: InitialStateV2<'number'>
): Reducer<LoadingStateV2<TModels, WhichType>> => (
	state,
	payload: Action<{
		name: string
		action: string
		detailedPayload: DetailedPayload
	}>['payload']
): LoadingStateV2<TModels, WhichType> => {
	const { name, action, detailedPayload } = payload || { name: '', action: '' }

	cntState.global += i
	cntState.models[name] += i
	cntState.effects[name][action] += i

	return {
		...state,
		global: converter(cntState.global, detailedPayload),
		models: {
			...state.models,
			[name]: converter(cntState.models[name], detailedPayload),
		},
		effects: {
			...state.effects,
			[name]: {
				...state.effects[name],
				[action]: converter(cntState.effects[name][action], detailedPayload),
			},
		},
	}
}

const validateConfig = (config: LoadingConfig): void => {
	if (process.env.NODE_ENV !== 'production') {
		if (config.name && typeof config.name !== 'string') {
			throw new Error('loading plugin config name must be a string')
		}
		if (config.asNumber && typeof config.asNumber !== 'boolean') {
			throw new Error('loading plugin config asNumber must be a boolean')
		}
		if (config.asNumber) {
			console.warn(
				[
					'@rematch/loading deprecation warning:',
					'\n',
					'"asNumber" property from @rematch/loading is deprecated, consider replacing "asNumber" to "type": "number".',
					'\n',
					'In future Rematch versions, "asNumber" will be removed.',
				].join(' ')
			)
		}
		if (config.whitelist && !Array.isArray(config.whitelist)) {
			throw new Error(
				'loading plugin config whitelist must be an array of strings'
			)
		}
		if (config.blacklist && !Array.isArray(config.blacklist)) {
			throw new Error(
				'loading plugin config blacklist must be an array of strings'
			)
		}
		if (config.whitelist && config.blacklist) {
			throw new Error(
				'loading plugin config cannot have both a whitelist & a blacklist'
			)
		}
	}
}

function assignExtraPayload<T, B>(insert: boolean, error: T, success: B) {
	return insert ? { error, success } : null
}

export default <
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>,
	TConfig extends LoadingConfig
>(
	config: TConfig = {} as TConfig
): Plugin<
	TModels,
	TExtraModels,
	ExtraModelsFromLoading<
		TModels,
		TConfig extends LoadingConfig ? TConfig : { type: 'boolean' }
	>
> => {
	validateConfig(config)

	const loadingModelName = config.name || 'loading'
	if (config.asNumber) {
		config.type = 'number'
	}
	const isAsNumber = config.type === 'number'
	const isAsDetailed = config.type === 'full'

	const converter: Converter<LoadingPluginType> = (cnt, detailedPayload) => {
		if (isAsNumber) return cnt
		if (isAsDetailed && detailedPayload) {
			return { ...detailedPayload, loading: cnt > 0 } as DetailedPayload
		}
		if (isAsDetailed) {
			return { loading: cnt > 0, success: false, error: false }
		}
		return cnt > 0
	}

	const loadingInitialState: InitialStateV2<LoadingPluginType> = {
		global: converter(0),
		models: {},
		effects: {},
	}

	const cntState: InitialStateV2<'number'> = {
		global: 0,
		models: {},
		effects: {},
	}
	const loading: LoadingModelV2<TModels, LoadingPluginType> = {
		name: loadingModelName,
		reducers: {
			hide: createLoadingAction(converter, -1, cntState),
			show: createLoadingAction(converter, 1, cntState),
		},
		state: loadingInitialState as LoadingStateV2<TModels, LoadingPluginType>,
	}

	const initialLoadingValue = converter(0)

	return {
		config: {
			models: {
				loading,
			},
		},
		onModel({ name }, rematch): void {
			// do not run dispatch on "loading" model
			if (name === loadingModelName) {
				return
			}

			cntState.models[name] = 0
			cntState.effects[name] = {}

			loadingInitialState.models[name] = initialLoadingValue as number
			loadingInitialState.effects[name] = {}

			const modelActions = rematch.dispatch[name]

			// map over effects within models
			Object.keys(modelActions).forEach((action: string) => {
				if (rematch.dispatch[name][action].isEffect === false) {
					return
				}

				cntState.effects[name][action] = 0
				loadingInitialState.effects[name][
					action
				] = initialLoadingValue as number

				const actionType = `${name}/${action}`

				// ignore items not in whitelist
				if (config.whitelist && !config.whitelist.includes(actionType)) {
					return
				}

				// ignore items in blacklist
				if (config.blacklist && config.blacklist.includes(actionType)) {
					return
				}

				// copy orig effect pointer
				const origEffect = rematch.dispatch[name][action]

				// create function with pre & post loading calls
				const effectWrapper = (...props: any): any => {
					try {
						// show loading
						rematch.dispatch[loadingModelName].show({
							name,
							action,
							detailedPayload: assignExtraPayload(isAsDetailed, false, false),
						})
						// dispatch the original action
						const effectResult = origEffect(...props)

						// check if result is a promise
						if (effectResult?.then) {
							// hide loading when promise finishes either with success or error
							return effectResult
								.then((r: any) => {
									rematch.dispatch[loadingModelName].hide({
										name,
										action,
										detailedPayload: assignExtraPayload(
											isAsDetailed,
											false,
											true
										),
									})
									return r
								})
								.catch((err: any) => {
									rematch.dispatch[loadingModelName].hide({
										name,
										action,
										detailedPayload: assignExtraPayload(
											isAsDetailed,
											err,
											false
										),
									})
									throw err
								})
						}

						// original action doesn't return a promise so there's nothing to wait for
						rematch.dispatch[loadingModelName].hide({
							name,
							action,
							detailedPayload: assignExtraPayload(isAsDetailed, false, true),
						})

						// return the original result of this reducer
						return effectResult
					} catch (error) {
						rematch.dispatch[loadingModelName].hide({
							name,
							action,
							detailedPayload: assignExtraPayload(isAsDetailed, error, false),
						})
						throw error
					}
				}

				effectWrapper.isEffect = true

				// replace existing effect with new wrapper
				rematch.dispatch[name][action] = effectWrapper
			})
		},
	}
}
