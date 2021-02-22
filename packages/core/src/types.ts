/*
 * Type definitions for Rematch v2.0.0
 * Project: Rematch
 * Definitions by:
 * Shawn McKay https://github.com/shmck
 * Bruno Lemos https://github.com/brunolemos
 * Przemyslaw Jamrozowicz https://github.com/pjamrozowicz
 * Tian Zhi https://github.com/tianzhich
 */

import {
	Action as ReduxAction,
	Reducer as ReduxReducer,
	Dispatch as ReduxDispatch,
	ReducersMapObject,
	Middleware,
	StoreEnhancer,
	StoreCreator,
	Store as ReduxStore,
	ActionCreator,
} from 'redux'

/**
 * Custom Action interface, adds an additional field - `payload`.
 *
 * Strings (instead of Symbols) are used as the type for `type` field inherited
 * from Redux, because strings are serializable.
 *
 * @template TPayload The type of the action's payload.
 */
export interface Action<TPayload = any, TMeta = any>
	extends ReduxAction<string> {
	payload?: TPayload
	meta?: TMeta
}

/**
 * Custom reducer which instead of an action (like in Redux), accepts payload as
 * as a second argument.
 *
 * @template TState The type of state consumed and produced by this reducer.
 */
export type Reducer<TState = any> = (
	state: TState,
	payload?: Action['payload'],
	meta?: Action['meta']
) => TState

/** ************************** Model *************************** */

/**
 * Mapping from a model key to model object.
 *
 * @template TModels List of all models
 */
export interface Models<TModels extends Models<TModels> = Record<string, any>> {
	[key: string]: Model<TModels>
}

export interface NamedModel<
	TModels extends Models<TModels> = Record<string, any>,
	TState = any,
	TBaseState = TState
> extends Model<TModels, TState, TBaseState> {
	name: string
	reducers: ModelReducers<TState>
}

export interface Model<
	TModels extends Models<TModels> = Record<string, any>,
	TState = any,
	TBaseState = TState
> {
	name?: string
	state: TState
	reducers?: ModelReducers<TState>
	baseReducer?: ReduxReducer<TBaseState>
	effects?: ModelEffects<TModels> | ModelEffectsCreator<TModels>
}

export type ModelReducers<TState = any> = {
	[key: string]: Reducer<TState>
}

export interface ModelEffects<
	TModels extends Models<TModels> = Record<string, any>
> {
	[key: string]: ModelEffect<TModels>
}

export type ModelEffect<
	TModels extends Models<TModels> = Record<string, any>
> = (
	payload: Action['payload'],
	rootState: RematchRootState<TModels>,
	meta: Action['meta']
) => any

export type ModelEffectsCreator<
	TModels extends Models<TModels> = Record<string, any>
> = (dispatch: RematchDispatch<TModels>) => ModelEffects<TModels>

/** ************************** Plugin *************************** */

export interface PluginConfig<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = Record<string, any>,
	TExposedModels = Partial<TExtraModels>
> {
	models?: TExposedModels
	redux?: InitConfigRedux
}

export interface Plugin<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = Record<string, any>,
	TExposedModels = Partial<TExtraModels>
> extends PluginHooks<TModels, TExtraModels> {
	config?: PluginConfig<TModels, TExtraModels, TExposedModels>
	exposed?: PluginExposed
}

export interface PluginHooks<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = Record<string, any>
> {
	onStoreCreated?: StoreCreatedHook<TModels, TExtraModels>
	onModel?: ModelHook<TModels, TExtraModels>
	onReducer?: ReducerHook<TModels, TExtraModels>
	onRootReducer?: RootReducerHook<TModels, TExtraModels>
	createMiddleware?: MiddlewareCreator<TModels>
}

export type ModelHook<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = Record<string, any>
> = (
	model: NamedModel<TModels>,
	rematch: RematchStore<TModels, TExtraModels>
) => void

export type ReducerHook<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = Record<string, any>
> = (
	reducer: ReduxReducer,
	modelName: string,
	rematch: RematchBag<TModels, TExtraModels>
) => ReduxReducer | void

export type RootReducerHook<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = Record<string, any>
> = (
	reducer: ReduxReducer,
	rematch: RematchBag<TModels, TExtraModels>
) => ReduxReducer | void

export type StoreCreatedHook<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = Record<string, any>
> = (
	store: RematchStore<TModels, TExtraModels>,
	rematch: RematchBag<TModels, TExtraModels>
) => RematchStore<TModels, TExtraModels> | void

export type MiddlewareCreator<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = Record<string, any>
> = (rematch: RematchBag<TModels, TExtraModels>) => Middleware

export type ObjectNotAFunction = { [k: string]: any } & (
	| { bind?: never }
	| { call?: never }
)

export type PluginExposed = {
	[key: string]: ExposedFunction | ObjectNotAFunction
}

export type ExposedFunction = (rematch: RematchStore<any>, ...args: any) => any

/** ************************** Rematch *************************** */

/**
 * Object for storing information needed for the Rematch store to run.
 * Purposefully hidden from the end user.
 */
export interface RematchBag<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = Record<string, any>
> {
	models: NamedModel<TModels>[]
	reduxConfig: ConfigRedux
	forEachPlugin: <Hook extends keyof PluginHooks<TModels, TExtraModels>>(
		method: Hook,
		fn: (content: NonNullable<PluginHooks<TModels, TExtraModels>[Hook]>) => void
	) => void
	effects: ModelEffects<TModels>
}

/**
 * Initial, optional configuration provided by the user which describes how
 * Rematch store should be configured.
 */
export interface InitConfig<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = Record<string, any>
> {
	name?: string
	models?: TModels
	plugins?: Plugin<TModels, TExtraModels>[]
	redux?: InitConfigRedux
}

/**
 * Config created out of the InitConfig by filling in missing properties with
 * default values and merging in modifications required by plugins
 * (new models, etc.).
 */
export interface Config<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = Record<string, any>
> extends InitConfig<TModels, TExtraModels> {
	name: string
	models: TModels
	plugins: Plugin<TModels, TExtraModels>[]
	redux: ConfigRedux
}

/** ************************** Rematch-Redux *************************** */

/**
 * Initial, optional configuration for Redux, provided by the user. It allows
 * to gain full control over the way Redux is configured by Rematch and
 * override any defaults.
 */
export interface InitConfigRedux<TRootState = any> {
	initialState?: TRootState
	reducers?: ModelReducers<TRootState>
	enhancers?: StoreEnhancer[]
	middlewares?: Middleware[]
	rootReducers?: ReducersMapObject<TRootState, Action>
	combineReducers?: (
		reducers: ReducersMapObject<TRootState, Action>
	) => ReduxReducer<TRootState>
	createStore?: StoreCreator
	devtoolOptions?: DevtoolOptions
}

/**
 * Config created out of InitConfigRedux by supplying default values in place
 * of missing properties.
 */
export interface ConfigRedux<TRootState = any>
	extends InitConfigRedux<TRootState> {
	reducers: ModelReducers<TRootState>
	enhancers: StoreEnhancer[]
	middlewares: Middleware[]
	rootReducers: ReducersMapObject<TRootState, Action>
}

export interface RematchStore<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = Record<string, any>
> extends ReduxStore<RematchRootState<TModels, TExtraModels>, Action> {
	[index: string]: ExposedFunction | Record<string, any> | string
	name: string
	dispatch: RematchDispatch<TModels>
	addModel: (model: NamedModel<TModels>) => void
}

/** ************************** Root State *************************** */

/**
 * The type of state held by a store.
 */
export type RematchRootState<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = Record<string, any>
> = ExtractRematchStateFromModels<TModels, TExtraModels>

/**
 * A mapping from each model's name to a type of state it holds.
 */
export type ExtractRematchStateFromModels<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = Record<string, any>
> = {
	[modelKey in keyof TModels]: TModels[modelKey]['state']
} &
	{
		[modelKey in keyof TExtraModels]: TExtraModels[modelKey]['state']
	}

/** ************************** Dispatch *************************** */

/**
 * Rematch dispatch is a combination of regular redux dispatch method and
 * an object allowing to dispatch specific actions by calling it the form of
 * dispatch[modelName][reducerName | effectName](payload).
 */
export type RematchDispatch<
	TModels extends Models<TModels> = Record<string, any>
> = ReduxDispatch & ExtractRematchDispatchersFromModels<TModels>

/**
 * Goes over all models and extracts from each a type for dispatcher object
 * created by Rematch.
 */
export type ExtractRematchDispatchersFromModels<
	TModels extends Models<TModels> = Record<string, any>
> = {
	[modelKey in keyof TModels]: TModels[modelKey] extends Model<TModels>
		? ModelDispatcher<TModels[modelKey], TModels>
		: never
}

/**
 * Combines together types extracted from reducers and effects for a model.
 */
export type ModelDispatcher<
	TModel extends Model<TModels> = Model,
	TModels extends Models<TModels> = Record<string, any>
> = ExtractRematchDispatchersFromReducers<TModel['state'], TModel['reducers']> &
	ExtractRematchDispatchersFromEffects<TModel['effects'], TModels>

/** ************************ Reducers Dispatcher ************************* */

/**
 * Extracts a dispatcher for each reducer that is defined for a model.
 */
export type ExtractRematchDispatchersFromReducers<
	TState,
	TReducers extends Model<Models, TState>['reducers']
> = {
	[reducerKey in keyof TReducers]: ExtractRematchDispatcherFromReducer<
		TState,
		TReducers[reducerKey]
	>
}

/**
 * Matches a reducer to different forms and based on the form, selects an
 * appropriate type for a dispatcher. Mapping goes like this:
 * - reducer not taking any parameters -> 'empty' dispatcher
 * - reducer only taking state -> 'empty' dispatcher
 * - reducer taking both state and payload -> dispatcher accepting payload as an argument
 * - reducer taking state, payload and meta -> dispatcher accepting payload and meta as arguments
 */
export type ExtractRematchDispatcherFromReducer<
	TState,
	TReducer
> = TReducer extends () => any
	? RematchDispatcher
	: TReducer extends (state: TState) => TState // support optional payload(and meta) like `(state: TState, payload?: ..., meta?: ...) => TState`
	? Parameters<TReducer> extends [TState]
		? RematchDispatcher
		: Parameters<TReducer>[2] extends undefined
		? RematchDispatcher<Parameters<TReducer>[1]>
		: RematchDispatcher<Parameters<TReducer>[1], Parameters<TReducer>[2]>
	: TReducer extends (state: TState, payload: infer TPayload) => TState // support optional meta like `(state: TState, payload: ..., meta?: ...) => TState`
	? Parameters<TReducer> extends [TState, TPayload]
		? RematchDispatcher<TPayload>
		: RematchDispatcher<Parameters<TReducer>[1], Parameters<TReducer>[2]>
	: TReducer extends (
			state: TState,
			payload: infer TPayload,
			meta: infer TMeta
	  ) => TState
	? RematchDispatcher<TPayload, TMeta>
	: never

/**
 * When payload is of type void, it describes 'empty' dispatcher - meaning
 * it's a function not taking any arguments and returning an action.
 * Otherwise, it describes dispatcher which accepts one argument (payload)
 * and returns an action.
 */
export type RematchDispatcher<TPayload = void, TMeta = void> = [
	TPayload,
	TMeta
] extends [void, void]
	? (() => Action<void, void>) & { isEffect: false }
	: [TMeta] extends [void]
	? undefined extends TPayload
		? ((payload?: TPayload) => Action<TPayload, void>) & {
				isEffect: false
		  }
		: ((payload: TPayload) => Action<TPayload, void>) & {
				isEffect: false
		  }
	: [undefined, undefined] extends [TPayload, TMeta]
	? ((payload?: TPayload, meta?: TMeta) => Action<TPayload, TMeta>) & {
			isEffect: false
	  }
	: undefined extends TMeta
	? ((payload: TPayload, meta?: TMeta) => Action<TPayload, TMeta>) & {
			isEffect: false
	  }
	: ((payload: TPayload, meta: TMeta) => Action<TPayload, TMeta>) & {
			isEffect: false
	  }

/** ************************ Effects Dispatcher ************************* */

/**
 * Based on the shape of 'effects' property it extracts dispatchers from it.
 * 'effects' can be:
 * - empty - in this case the type is just void
 * - an object defining effects
 * - a function returning effects
 * If it's a function it infers its return type which must define effects.
 */
export type ExtractRematchDispatchersFromEffects<
	TEffects extends Model<TModels>['effects'],
	TModels extends Models<TModels> = Record<string, any>
> = TEffects extends (...args: any[]) => infer R
	? R extends ModelEffects<TModels>
		? ExtractRematchDispatchersFromEffectsObject<R, TModels>
		: never
	: TEffects extends ModelEffects<TModels>
	? ExtractRematchDispatchersFromEffectsObject<TEffects, TModels>
	: void

/**
 * Extracts a dispatcher for each effect that is defined for a model.
 */
export type ExtractRematchDispatchersFromEffectsObject<
	TEffects extends ModelEffects<TModels>,
	TModels extends Models<TModels> = Record<string, any>
> = {
	[effectKey in keyof TEffects]: ExtractRematchDispatcherFromEffect<
		TEffects[effectKey],
		TModels
	>
}

/**
 * Matches an effect to different forms and based on the form, selects an
 * appropriate type for a dispatcher. Mapping goes like this:
 * - effect not taking any parameters -> 'empty' dispatcher
 * - effect only taking payload -> dispatcher accepting payload as an argument
 * - effect taking both payload and root state -> dispatcher accepting payload
 *   as an argument
 */
export type ExtractRematchDispatcherFromEffect<
	TEffect extends ModelEffect<TModels>,
	TModels extends Models<TModels> = Record<string, any>
> = TEffect extends () => infer TReturn
	? EffectRematchDispatcher<TReturn>
	: TEffect extends (payload: infer TPayload) => infer TReturn
	? EffectRematchDispatcher<TReturn, TPayload>
	: TEffect extends (payload: infer TPayload, state: any) => infer TReturn
	? EffectRematchDispatcher<TReturn, TPayload>
	: TEffect extends (
			payload: infer TPayload,
			state: any,
			meta: infer TMeta
	  ) => infer TReturn
	? EffectRematchDispatcher<TReturn, TPayload, TMeta>
	: never

/**
 * When payload is of type void, it describes 'empty' dispatcher - meaning
 * it's a function not taking any arguments and returning an action.
 * Otherwise, it describes dispatcher which accepts one argument (payload)
 * and returns an action.
 */
export type EffectRematchDispatcher<
	TReturn = any,
	TPayload = void,
	TMeta = void
> = [TPayload] extends [void]
	? (() => TReturn) & { isEffect: true }
	: ((payload: TPayload, meta: TMeta) => TReturn) & { isEffect: true }

export interface DevtoolOptions {
	/**
	 * Disables Devtools options, useful for production usages
	 */
	disabled?: boolean
	/**
	 * the instance name to be showed on the monitor page. Default value is `document.title`.
	 * If not specified and there's no document title, it will consist of `tabId` and `instanceId`.
	 */
	name?: string
	/**
	 * action creators functions to be available in the Dispatcher.
	 */
	actionCreators?: ActionCreator<any>[] | { [key: string]: ActionCreator<any> }
	/**
	 * if more than one action is dispatched in the indicated interval, all new actions will be collected and sent at once.
	 * It is the joint between performance and speed. When set to `0`, all actions will be sent instantly.
	 * Set it to a higher value when experiencing perf issues (also `maxAge` to a lower value).
	 *
	 * @default 500 ms.
	 */
	latency?: number
	/**
	 * (> 1) - maximum allowed actions to be stored in the history tree. The oldest actions are removed once maxAge is reached. It's critical for performance.
	 *
	 * @default 50
	 */
	maxAge?: number
	/**
	 * - `undefined` - will use regular `JSON.stringify` to send data (it's the fast mode).
	 * - `false` - will handle also circular references.
	 * - `true` - will handle also date, regex, undefined, error objects, symbols, maps, sets and functions.
	 * - object, which contains `date`, `regex`, `undefined`, `error`, `symbol`, `map`, `set` and `function` keys.
	 *   For each of them you can indicate if to include (by setting as `true`).
	 *   For `function` key you can also specify a custom function which handles serialization.
	 *   See [`jsan`](https://github.com/kolodny/jsan) for more details.
	 */
	serialize?:
		| boolean
		| {
				date?: boolean
				regex?: boolean
				undefined?: boolean
				error?: boolean
				symbol?: boolean
				map?: boolean
				set?: boolean
				function?: boolean | Function
		  }
	/**
	 * function which takes `action` object and id number as arguments, and should return `action` object back.
	 */
	actionSanitizer?: <A extends Action>(action: A, id: number) => A
	/**
	 * function which takes `state` object and index as arguments, and should return `state` object back.
	 */
	stateSanitizer?: <S>(state: S, index: number) => S
	/**
	 * *string or array of strings as regex* - actions types to be hidden / shown in the monitors (while passed to the reducers).
	 * If `actionsWhitelist` specified, `actionsBlacklist` is ignored.
	 */
	actionsBlacklist?: string | string[]
	/**
	 * *string or array of strings as regex* - actions types to be hidden / shown in the monitors (while passed to the reducers).
	 * If `actionsWhitelist` specified, `actionsBlacklist` is ignored.
	 */
	actionsWhitelist?: string | string[]
	/**
	 * called for every action before sending, takes `state` and `action` object, and returns `true` in case it allows sending the current data to the monitor.
	 * Use it as a more advanced version of `actionsBlacklist`/`actionsWhitelist` parameters.
	 */
	predicate?: <S, A extends Action>(state: S, action: A) => boolean
	/**
	 * if specified as `false`, it will not record the changes till clicking on `Start recording` button.
	 * Available only for Redux enhancer, for others use `autoPause`.
	 *
	 * @default true
	 */
	shouldRecordChanges?: boolean
	/**
	 * if specified, whenever clicking on `Pause recording` button and there are actions in the history log, will add this action type.
	 * If not specified, will commit when paused. Available only for Redux enhancer.
	 *
	 * @default "@@PAUSED""
	 */
	pauseActionType?: string
	/**
	 * auto pauses when the extension’s window is not opened, and so has zero impact on your app when not in use.
	 * Not available for Redux enhancer (as it already does it but storing the data to be sent).
	 *
	 * @default false
	 */
	autoPause?: boolean
	/**
	 * if specified as `true`, it will not allow any non-monitor actions to be dispatched till clicking on `Unlock changes` button.
	 * Available only for Redux enhancer.
	 *
	 * @default false
	 */
	shouldStartLocked?: boolean
	/**
	 * if set to `false`, will not recompute the states on hot reloading (or on replacing the reducers). Available only for Redux enhancer.
	 *
	 * @default true
	 */
	shouldHotReload?: boolean
	/**
	 * if specified as `true`, whenever there's an exception in reducers, the monitors will show the error message, and next actions will not be dispatched.
	 *
	 * @default false
	 */
	shouldCatchErrors?: boolean
	/**
	 * If you want to restrict the extension, specify the features you allow.
	 * If not specified, all of the features are enabled. When set as an object, only those included as `true` will be allowed.
	 * Note that except `true`/`false`, `import` and `export` can be set as `custom` (which is by default for Redux enhancer), meaning that the importing/exporting occurs on the client side.
	 * Otherwise, you'll get/set the data right from the monitor part.
	 */
	features?: {
		/**
		 * start/pause recording of dispatched actions
		 */
		pause?: boolean
		/**
		 * lock/unlock dispatching actions and side effects
		 */
		lock?: boolean
		/**
		 * persist states on page reloading
		 */
		persist?: boolean
		/**
		 * export history of actions in a file
		 */
		export?: boolean | 'custom'
		/**
		 * import history of actions from a file
		 */
		import?: boolean | 'custom'
		/**
		 * jump back and forth (time travelling)
		 */
		jump?: boolean
		/**
		 * skip (cancel) actions
		 */
		skip?: boolean
		/**
		 * drag and drop actions in the history list
		 */
		reorder?: boolean
		/**
		 * dispatch custom actions or action creators
		 */
		dispatch?: boolean
		/**
		 * generate tests for the selected actions
		 */
		test?: boolean
	}
	/**
	 * Set to true or a stacktrace-returning function to record call stack traces for dispatched actions.
	 * Defaults to false.
	 */
	trace?: boolean | (<A extends Action>(action: A) => string)
	/**
	 * The maximum number of stack trace entries to record per action. Defaults to 10.
	 */
	traceLimit?: number
	[key: string]: any
}

export interface ModelCreator {
	<RM extends Models<RM>>(): <
		R extends ModelReducers<S>,
		BR extends ReduxReducer<BS>,
		E extends ModelEffects<RM> | ModelEffectsCreator<RM>,
		S,
		BS = S
	>(mo: {
		name?: string
		state: S
		reducers?: R
		baseReducer?: BR
		effects?: E
	}) => {
		name?: string
		state: S
		reducers: R
		baseReducer: BR
		effects: E
	}
}

declare module 'redux' {
	export interface Dispatch<A extends Action = AnyAction> {
		[modelName: string]: any
	}
}

/**
 * Patch for the incompatibility between Redux.Dispatch and RematchDispatch
 */
declare module 'react-redux' {
	interface Connect {
		<
			RM extends Models<RM> = Models,
			State = DefaultRootState,
			TStateProps = Record<string, any>,
			TDispatchProps = Record<string, any>,
			TOwnProps = Record<string, any>
		>(
			mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>,
			mapDispatchToProps: MapRematchDispatchToPropsNonObject<
				TDispatchProps,
				TOwnProps,
				RM
			>
		): InferableComponentEnhancerWithProps<
			TStateProps & TDispatchProps,
			TOwnProps
		>
	}

	type MapRematchDispatchToPropsNonObject<
		TDispatchProps,
		TOwnProps,
		RM extends Models<RM> = Models
	> =
		| MapRematchDispatchToPropsFactory<TDispatchProps, TOwnProps, RM>
		| MapRematchDispatchToPropsFunction<TDispatchProps, TOwnProps, RM>

	type MapRematchDispatchToPropsFactory<
		TDispatchProps,
		TOwnProps,
		RM extends Models<RM> = Models
	> = (
		dispatch: RematchDispatch<RM>,
		ownProps: TOwnProps
	) => MapRematchDispatchToPropsFunction<TDispatchProps, TOwnProps, RM>

	type MapRematchDispatchToPropsFunction<
		TDispatchProps,
		TOwnProps,
		RM extends Models<RM> = Models
	> = (dispatch: RematchDispatch<RM>, ownProps: TOwnProps) => TDispatchProps
}

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any
	}
}
