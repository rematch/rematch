import * as R from '../typings'

const isObject = (obj: object): boolean =>
	Array.isArray(obj) || typeof obj !== 'object'

/**
 * validate
 *
 * takes an array of arrays of validations and
 * throws if an error occurs
 */
const validate = (validations: R.Validation[]): void => {
	if (process.env.NODE_ENV !== 'production') {
		for (const validation of validations) {
			const condition = validation[0]
			const errorMessage = validation[1]
			if (condition) {
				throw new Error(errorMessage)
			}
		}
	}
}

export const validateConfig = (config: R.Config): void => {
	validate([
		[!Array.isArray(config.plugins), 'init config.plugins must be an array'],
		[isObject(config.models), 'init config.models must be an object'],
		[
			isObject(config.redux.reducers),
			'init config.redux.reducers must be an object',
		],
		[
			!Array.isArray(config.redux.middlewares),
			'init config.redux.middlewares must be an array',
		],
		[
			!Array.isArray(config.redux.enhancers),
			'init config.redux.enhancers must be an array of functions',
		],
		[
			config.redux.combineReducers &&
				typeof config.redux.combineReducers !== 'function',
			'init config.redux.combineReducers must be a function',
		],
		[
			config.redux.createStore &&
				typeof config.redux.createStore !== 'function',
			'init config.redux.createStore must be a function',
		],
	])
}

export const validateModel = (model: R.Model): void => {
	validate([
		[!model, 'model config is required'],
		[typeof model.name !== 'string', 'model "name" [string] is required'],
		[
			model.state === undefined && model.baseReducer === undefined,
			'model "state" is required',
		],
		[
			model.baseReducer !== undefined &&
				typeof model.baseReducer !== 'function',
			'model "baseReducer" must be a function',
		],
	])
}

export const validatePlugin = (plugin: R.Plugin): void => {
	validate([
		[
			plugin.onStoreCreated && typeof plugin.onStoreCreated !== 'function',
			'Plugin onStoreCreated must be a function',
		],
		[
			plugin.onModel && typeof plugin.onModel !== 'function',
			'Plugin onModel must be a function',
		],
		[
			plugin.onReducer && typeof plugin.onReducer !== 'function',
			'Plugin onReducer must be a function',
		],
		[
			plugin.onRootReducer && typeof plugin.onRootReducer !== 'function',
			'Plugin onRootReducer must be a function',
		],
		[
			plugin.createMiddleware && typeof plugin.createMiddleware !== 'function',
			'Plugin createMiddleware must be a function',
		],
	])
}

export default validate
