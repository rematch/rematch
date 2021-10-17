import * as Redux from 'redux'
import {
	Action,
	ConfigRedux,
	ModelReducers,
	NamedModel,
	RematchBag,
	DevtoolOptions,
	Models,
	RematchRootState,
} from './types'

/**
 * Creates 'combined' reducer for each model and then merges those reducers
 * together into a 'root' reducer. It then creates a Redux store with
 * middlewares and enhancers.
 */
export default function createReduxStore<
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>,
	RootState = RematchRootState<TModels, TExtraModels>
>(bag: RematchBag<TModels, TExtraModels>): Redux.Store<RootState> {
	bag.models.forEach((model) => createModelReducer(bag, model))

	const rootReducer = createRootReducer<RootState, TModels, TExtraModels>(bag)

	const middlewares = Redux.applyMiddleware(...bag.reduxConfig.middlewares)
	const enhancers = bag.reduxConfig.devtoolComposer
		? bag.reduxConfig.devtoolComposer(...bag.reduxConfig.enhancers, middlewares)
		: composeEnhancersWithDevtools(bag.reduxConfig.devtoolOptions)(
				...bag.reduxConfig.enhancers,
				middlewares
		  )

	const createStore = bag.reduxConfig.createStore || Redux.createStore
	const bagInitialState = bag.reduxConfig.initialState
	const initialState = bagInitialState === undefined ? {} : bagInitialState

	return createStore<RootState, Action, any, typeof initialState>(
		rootReducer,
		initialState,
		enhancers
	)
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
export function createModelReducer<
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>,
	TState extends NamedModel<TModels>['state'] = any
>(bag: RematchBag<TModels, TExtraModels>, model: NamedModel<TModels>): void {
	const modelReducers: ModelReducers<TState> = {}

	// build action name for each reducer and create mapping from name to reducer
	const modelReducerKeys = Object.keys(model.reducers)
	modelReducerKeys.forEach((reducerKey) => {
		const actionName = isAlreadyActionName(reducerKey)
			? reducerKey
			: `${model.name}/${reducerKey}`

		modelReducers[actionName] = model.reducers[reducerKey]
	})

	// select and run a reducer based on the incoming action
	const combinedReducer = (
		state: TState = model.state,
		action: Action
	): TState => {
		if (action.type in modelReducers) {
			return modelReducers[action.type](
				state,
				action.payload,
				action.meta
				// we use augmentation because a reducer can return void due immer plugin,
				// which makes optional returning the reducer state
			) as TState
		}

		return state
	}

	const modelBaseReducer = model.baseReducer

	// when baseReducer is defined, run the action first through it
	let reducer = !modelBaseReducer
		? combinedReducer
		: (state: TState = model.state, action: Action): TState =>
				combinedReducer(modelBaseReducer(state, action), action)

	bag.forEachPlugin('onReducer', (onReducer) => {
		reducer = onReducer(reducer, model.name, bag) || reducer
	})

	bag.reduxConfig.reducers[model.name] = reducer
}

/**
 * It merges all reducers in config using mergeReducers function. Additionally,
 * if user supplied any rootReducers, a wrapper function around merged reducers
 * is created. It first feeds each into its corresponding 'root' reducer (if
 * it's available), and then passes on the resulting state to the merged reducer.
 */
export function createRootReducer<
	TRootState,
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>
>(bag: RematchBag<TModels, TExtraModels>): Redux.Reducer<TRootState, Action> {
	const { rootReducers } = bag.reduxConfig
	const mergedReducers = mergeReducers<TRootState>(bag.reduxConfig)
	let rootReducer = mergedReducers

	if (rootReducers && Object.keys(rootReducers).length) {
		rootReducer = (
			state: TRootState | undefined,
			action: Action
		): TRootState => {
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
 * Merges all reducers defined in config into one function using user supplied
 * or default combineReducers function.
 * If there are no reducers defined, it returns a function that just returns
 * the state for all incoming actions.
 */
function mergeReducers<TRootState>(
	reduxConfig: ConfigRedux<TRootState>
): Redux.Reducer<TRootState, Action> {
	const combineReducers = reduxConfig.combineReducers || Redux.combineReducers

	if (!Object.keys(reduxConfig.reducers).length) {
		return (state: any): TRootState => state
	}

	return combineReducers(reduxConfig.reducers as Redux.ReducersMapObject)
}

/**
 * Returns Redux Devtools compose method unless it's disabled, in which case it
 * returns default Redux.compose.
 */
function composeEnhancersWithDevtools(
	devtoolOptions: DevtoolOptions = {}
): (...args: any[]) => Redux.StoreEnhancer {
	return !devtoolOptions.disabled &&
		typeof window === 'object' &&
		window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devtoolOptions)
		: Redux.compose
}

/**
 * Determines if a reducer key is already an action name, for example -
 * a listener on another model.
 */
function isAlreadyActionName(reducerKey: string): boolean {
	return reducerKey.indexOf('/') > -1
}
