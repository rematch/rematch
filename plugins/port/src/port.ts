import { ModelConfig, Plugin, RematchStore } from '@rematch/core'
import {
	ActionCreatorsMapObject,
	combineReducers,
	Middleware,
	Reducer,
	ReducersMapObject,
} from 'redux'

interface PortConfig {
	modelName?: string
	initialState?: any
	actionCreators?: ActionCreatorsMapObject
	reducer?: Reducer
	middleware?: Middleware
	expose?: {} | ((store: RematchStore) => {})
	combineReducers?: typeof combineReducers
	mapReducers?: (reducers: ReducersMapObject) => ReducersMapObject
	mapRootReducer?: (rootReducer: Reducer) => Reducer
}

export default function port(config: PortConfig = {}): Plugin {
	const redux = { combineReducers: config.combineReducers }

	const model: ModelConfig = config.modelName
		? {
				name: config.modelName,
				baseReducer: config.reducer,
				state: config.initialState || null,
		  }
		: null

	return {
		config: {
			redux,
			models: model ? { [config.modelName]: model } : {},
		},
		middleware: config.middleware,
		onInit() {
			if (config.mapReducers) {
				const combine = this.config.redux.combineReducers || combineReducers

				this.config.redux.combineReducers = reducers =>
					combine(config.mapReducers(reducers))
			}

			if (config.mapRootReducer) {
				const combine = this.config.redux.combineReducers || combineReducers

				this.config.redux.combineReducers = reducers =>
					config.mapRootReducer(combine(reducers))
			}
		},
		onStoreCreated(store) {
			if (config.actionCreators) {
				this.validate([
					[
						!model,
						'ported action creators require a model name to namespace them',
					],
				])

				for (const actionName of Object.keys(config.actionCreators)) {
					this.dispatch[config.modelName][actionName] = (...args) =>
						this.dispatch(config.actionCreators[actionName](...args))
				}
			}

			return typeof config.expose === 'function'
				? config.expose(store)
				: config.expose
		},
	}
}
