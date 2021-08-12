import {
	Plugin,
	ModelEffects,
	ModelEffectsCreator,
	ModelReducers,
	Models,
} from '@rematch/core'

import { Reducer } from 'redux'

const cachedTypings: Record<string, any> = {}

export type TypedStateConfiguration = {
	strict?: boolean
	logSeverity?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'
}

const DEFAULT_SETTINGS: TypedStateConfiguration = {
	logSeverity: 'warn',
	strict: false,
}
const PROP_TYPES_SECRET = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED'

export function logger(
	logSeverity: TypedStateConfiguration['logSeverity'],
	m: string
): void {
	if (!logSeverity) return
	if (logSeverity === 'fatal') {
		throw Error(m)
	}

	// eslint-disable-next-line no-console
	console[logSeverity](m)
}

function validate(
	typeSpecs: Record<string, any>,
	values: Record<string, any>,
	modelName: string,
	config: TypedStateConfiguration
): void {
	if (process.env.NODE_ENV !== 'production') {
		const keys = Object.keys(typeSpecs)
		keys.forEach((typeSpecName) => {
			if (typeSpecs[typeSpecName]) {
				const error = typeSpecs[typeSpecName](
					values,
					typeSpecName,
					modelName,
					'property',
					null,
					PROP_TYPES_SECRET
				)

				if (error instanceof Error && config.logSeverity) {
					logger(config.logSeverity, `[rematch] ${error.message}`)
				}
			}
		})
	}
}

const typedStatePlugin = <
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels> = Record<string, any>
>(
	config = DEFAULT_SETTINGS
): Plugin<TModels, TExtraModels> => {
	if (!config.logSeverity && config.strict) config.logSeverity = 'warn'
	if (!config.strict) config.strict = false

	return {
		onModel(model): void {
			cachedTypings[model.name] = model.typings
		},
		createMiddleware: () => (store) => (next) => (action) => {
			const called = next(action)
			const [modelName] = action.type.split('/')
			const typings = cachedTypings[modelName]
			if (typings) {
				validate(typings, store.getState()[modelName], modelName, config)
			} else if (config.strict && config.logSeverity) {
				logger(
					config.logSeverity,
					`[rematch]: Missing typings definitions for \`${modelName}\` model`
				)
			}
			return called
		},
	}
}

export default typedStatePlugin

declare module '@rematch/core' {
	interface Model<
		TModels extends Models<TModels> = Record<string, any>,
		TState = any
	> {
		typings?: Record<string, any>
	}

	// add overloads for ModelCreator here.
	interface ModelCreator {
		<RM extends Models<RM>>(): <
			R extends ModelReducers<S>,
			BR extends Reducer<BS>,
			E extends ModelEffects<RM> | ModelEffectsCreator<RM>,
			S,
			BS = S
		>(mo: {
			name?: string
			state: S
			reducers?: R
			baseReducer?: BR
			effects?: E
			typings?: Record<string, any>
		}) => {
			name?: string
			state: S
			typings?: Record<string, any>
			reducers: R
			baseReducer: BR
			effects: E
		}
	}
}
