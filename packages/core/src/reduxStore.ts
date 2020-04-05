import * as Redux from 'redux'
import {
	Action,
	ConfigRedux,
	ModelReducers,
	NamedModel,
	RematchBag,
	DevtoolOptions,
	Models,
} from './types'

/**
 * Determines if a reducer key is already an action name, for example -
 * a listener on another model.
 */
const isAlreadyActionName = (reducerKey: string): boolean =>
	reducerKey.indexOf('/') > -1

/**
 * Returns Redux Devtools compose method unless it's disabled, in which case it
 * returns default Redux.compose.
 */
const composeEnhancersWithDevtools = (
	devtoolOptions: DevtoolOptions = {}
): ((...args: any[]) => Redux.StoreEnhancer) => {
	const { disabled, ...options } = devtoolOptions

	return !disabled &&
		typeof window === 'object' &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(options)
		: Redux.compose
}

/**
 * Creates a combined reducer for a given model. What it means is that:
 * - it forms an action name for each model's reducer as 'modelName/reducerKey'
 * - it creates a mapping from action name to its reducer
 * - it wraps the mapping with a function (combined reducer) that selects and
 *   runs a reducer based on the incoming action
 * - if the model also has a base reducer defined, it creates a function which
 *   first runs the incoming action through this reducer and then passes the
 *   resulting state and the same action to combined reducer
 *
 * The final result - a function, is returned.
 */
export const createModelReducer = <
	M extends Models,
	T extends NamedModel,
	S extends T['state']
>(
	bag: RematchBag<M>,
	model: T
): void => {
	const modelReducers: ModelReducers<S> = {}

	// build action name for each reducer and create mapping from name to reducer
	for (const reducerKey of Object.keys(model.reducers)) {
		const actionName = isAlreadyActionName(reducerKey)
			? reducerKey
			: `${model.name}/${reducerKey}`

		modelReducers[actionName] = model.reducers[reducerKey]
	}

	// select and run a reducer based on the incoming action
	const combinedReducer = (state: S = model.state, action: Action): S => {
		if (action.type in modelReducers) {
			return modelReducers[action.type](state, action.payload)
		}

		return state
	}

	const modelBaseReducer = model.baseReducer

	// when baseReducer is defined, run the action first through it
	let reducer = !modelBaseReducer
		? combinedReducer
		: (state: S = model.state, action: Action): S =>
				combinedReducer(modelBaseReducer(state, action), action)

	bag.forEachPlugin('onReducer', (onReducer) => {
		reducer = onReducer(reducer, model.name, bag) || reducer
	})

	bag.reduxConfig.reducers[model.name] = reducer
}

/**
 * Merges all reducers defined in config into one function using user supplied
 * or default combineReducers function.
 * If there are no reducers defined, it returns a function that just returns
 * the state for all incoming actions.
 */
const mergeReducers = <S>(
	reduxConfig: ConfigRedux<S>
): Redux.Reducer<S, Action> => {
	const combineReducers = reduxConfig.combineReducers || Redux.combineReducers

	if (!Object.keys(reduxConfig.reducers).length) {
		return (state: any): S => state
	}

	return combineReducers(reduxConfig.reducers as Redux.ReducersMapObject)
}

/**
 * It merges all reducers in config using mergeReducers function. Additionally,
 * if user supplied any rootReducers, a wrapper function around merged reducers
 * is created. It first feeds each into its corresponding 'root' reducer (if
 * it's available), and then passes on the resulting state to the merged reducer.
 */
export const createRootReducer = <M extends Models, S>(
	bag: RematchBag<M>
): Redux.Reducer<S, Action> => {
	const { rootReducers } = bag.reduxConfig
	const mergedReducers = mergeReducers<S>(bag.reduxConfig)
	let rootReducer = mergedReducers

	if (rootReducers && Object.keys(rootReducers).length) {
		rootReducer = (state: S | undefined, action: Action): S => {
			const actionRootReducer = rootReducers[action.type]

			if (actionRootReducer) {
				return mergedReducers(actionRootReducer(state, action), action)
			}

			return mergedReducers(state, action)
		}
	}

	bag.forEachPlugin('onRootReducer', (onRootReducer) => {
		rootReducer = onRootReducer(rootReducer, bag) || rootReducer
	})

	return rootReducer
}

/**
 * Creates 'combined' reducer for each model and then merges those reducers
 * together into 'root' reducer.
 * Then, it creates middlewares and enhancers.
 */
const createReduxStore = <M extends Models>(
	bag: RematchBag<M>
): Redux.Store => {
	for (const model of bag.models) {
		createModelReducer(bag, model)
	}

	const rootReducer = createRootReducer(bag)

	const middlewares = Redux.applyMiddleware(...bag.reduxConfig.middlewares)
	const enhancers = composeEnhancersWithDevtools(
		bag.reduxConfig.devtoolOptions
	)(...bag.reduxConfig.enhancers, middlewares)

	const createStore = bag.reduxConfig.createStore || Redux.createStore
	const bagInitialState = bag.reduxConfig.initialState
	const initialState = bagInitialState === undefined ? {} : bagInitialState

	return createStore(rootReducer, initialState, enhancers)
}

export default createReduxStore
