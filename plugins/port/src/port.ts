import * as Rematch from '@rematch/core'
import * as Redux from 'redux'

interface PortConfig {
	modelName?: string
	initialState?: any
	actionCreators?: Redux.ActionCreatorsMapObject
	reducer?: Redux.Reducer
	middleware?: Redux.Middleware
	expose?: {} | ((store: Rematch.RematchStore) => {})
	combineReducers?: typeof Redux.combineReducers
	mapReducers?: (reducers: Redux.ReducersMapObject) => Redux.ReducersMapObject
	mapRootReducer?: (rootReducer: Redux.Reducer) => Redux.Reducer
}

export default function port(config: PortConfig = {}): Rematch.Plugin {
	validate(config)

	const redux = createReduxConfig(config)
	const model = createModelConfig(config)

	return {
		config: {
			redux,
			models: model ? { [model.name]: model } : {},
		},
		middleware: config.middleware,
		onInit() {
			this.config.redux = enhanceReduxConfig(this.config.redux, config)
		},
		onStoreCreated(store) {
			if (model) {
				Object.assign(
					this.dispatch[model.name],
					createDispatchers(this.dispatch, model.name, config)
				)
			}

			return typeof config.expose === 'function'
				? config.expose(store)
				: config.expose
		},
	}
}

function validate(config: PortConfig) {
	const depends = ['reducer', 'initialState', 'actionCreators'].filter(
		key => !!config[key]
	)
	if (!config.modelName && depends.length) {
		throw new Error(
			`The following options require a model name: ${depends.join(', ')}`
		)
	}
}

function createModelConfig(config: PortConfig): Rematch.ModelConfig {
	if (!config.modelName) {
		return null
	}

	return {
		name: config.modelName,
		baseReducer: config.reducer,
		state: config.initialState || null,
	}
}

function createDispatchers(
	dispatch: Redux.Dispatch,
	namespace: string,
	config: PortConfig
) {
	const dispatchers = {}

	if (config.actionCreators) {
		for (const actionName of Object.keys(config.actionCreators)) {
			dispatchers[actionName] = (...args) => {
				const action = config.actionCreators[actionName](...args)
				return Promise.all([
					dispatch(action),
					dispatch({ ...action, type: `${namespace}/${actionName}` }),
				])
			}
		}
	}

	return dispatchers
}

// Add options to be merged
function createReduxConfig(config: PortConfig): Rematch.InitConfigRedux {
	return {
		combineReducers: config.combineReducers,
	}
}

// Enhance pre-merged options
function enhanceReduxConfig(
	reduxConfig: Rematch.InitConfigRedux,
	config: PortConfig
): Rematch.InitConfigRedux {
	let combineReducers = reduxConfig.combineReducers || Redux.combineReducers

	if (config.mapReducers) {
		const combine = combineReducers
		combineReducers = reducers => combine(config.mapReducers(reducers))
	}

	if (config.mapRootReducer) {
		const combine = combineReducers
		combineReducers = reducers => config.mapRootReducer(combine(reducers))
	}

	return {
		...reduxConfig,
		combineReducers,
	}
}
