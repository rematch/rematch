// @ts-nocheck
import {
	ExtractRematchDispatchersFromEffects,
	NamedModel,
	Plugin,
	Models,
	RematchStore,
	Reducer,
	EffectAction,
} from '@rematch/core'

export interface LoadingConfig {
	name?: string
	whitelist?: string[]
	blacklist?: string[]
	asNumber?: boolean
}

export interface LoadingState<M extends Models, AsNumber extends boolean> {
	global: AsNumber extends true ? number : boolean
	models: { [modelName in keyof M]: AsNumber extends true ? number : boolean }
	effects: {
		[modelName in keyof M]: {
			[effectName in keyof ExtractRematchDispatchersFromEffects<
				M[modelName]['state'],
				M[modelName]['effects']
			>]: AsNumber extends true ? number : boolean
		}
	}
}

const createLoadingAction = (
	converter: any,
	i: any,
	cntState: any
): Reducer => (
	state: LoadingState<any, any>,
	{ name, action }: any
): LoadingState<any, any> => {
	cntState.global += i
	cntState.models[name] += i
	cntState.effects[name][action] += i

	return {
		...state,
		global: converter(cntState.global),
		models: {
			...state.models,
			[name]: converter(cntState.models[name]),
		},
		effects: {
			...state.effects,
			[name]: {
				...state.effects[name],
				[action]: converter(cntState.effects[name][action]),
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

export default <M extends Models>(config: LoadingConfig = {}): Plugin => {
	validateConfig(config)

	const loadingModelName = config.name || 'loading'

	const cntState = {
		global: 0,
		models: {} as any,
		effects: {} as any,
	}

	const isAsNumber = config.asNumber === true

	const loadingInitialState = {
		global: 0,
		models: {},
		effects: {},
	} as LoadingState<M, typeof isAsNumber>

	const converter = isAsNumber
		? (cnt: number): number => cnt
		: (cnt: number): boolean => cnt > 0

	const loading = {
		name: loadingModelName,
		reducers: {
			hide: createLoadingAction(converter, -1, cntState),
			show: createLoadingAction(converter, 1, cntState),
		},
		state: loadingInitialState,
	}

	const initialLoadingValue = converter(0)

	loadingInitialState.global = initialLoadingValue

	return {
		config: {
			models: {
				loading,
			},
		},
		onModel({ name }: NamedModel, rematch: RematchStore): void {
			// do not run dispatch on "loading" model
			if (name === loadingModelName) {
				return
			}

			cntState.models[name] = 0
			cntState.effects[name] = {}

			loadingInitialState.models[name] = initialLoadingValue
			loadingInitialState.effects[name] = {}

			const modelActions = rematch.dispatch[name]

			// map over effects within models
			Object.keys(modelActions).forEach((action: string) => {
				if (!rematch.dispatch[name][action].isEffect) {
					return
				}

				cntState.effects[name][action] = 0
				loadingInitialState.effects[name][action] = initialLoadingValue

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
						rematch.dispatch[loadingModelName].show({ name, action })
						// dispatch the original action
						const effectResult = origEffect(...props) as EffectAction

						// check if result is a promise
						if (effectResult?.result?.then) {
							// hide loading when promise finishes either with success or error
							effectResult.result
								.then((r) => {
									rematch.dispatch[loadingModelName].hide({ name, action })
									return r
								})
								.catch((err) => {
									rematch.dispatch[loadingModelName].hide({ name, action })
									throw err
								})
						} else {
							// original action doesn't return a promise so there's nothing to wait for
							rematch.dispatch[loadingModelName].hide({ name, action })
						}

						// return the original result of this reducer
						return effectResult
					} catch (error) {
						rematch.dispatch[loadingModelName].hide({ name, action })
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
