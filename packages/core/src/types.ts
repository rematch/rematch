/*
 * Type definitions for Rematch v2.0.0
 * Project: Rematch
 * Definitions by:
 * Shawn McKay https://github.com/shmck
 * Bruno Lemos https://github.com/brunolemos
 * Przemyslaw Jamrozowicz https://github.com/pjamrozowicz
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
} from 'redux'

/**
 * Custom Action interface, adds an additional field - `payload`.
 *
 * Strings (instead of Symbols) are used as the type for `type` field inherited
 * from Redux, because strings are serializable.
 *
 * @template TPayload The type of the action's payload.
 */
export interface Action<TPayload = any> extends ReduxAction<string> {
	payload?: TPayload
}

/**
 * Custom reducer which instead of an action (like in Redux), accepts payload as
 * as a second argument.
 *
 * @template TState The type of state consumed and produced by this reducer.
 */
export type Reducer<TState = any> = (
	state: TState,
	payload?: Action['payload']
) => TState

/** ************************** Model *************************** */

/**
 * Mapping from a model key to model object.
 *
 * @template AllModelsKeys List of all models' names
 */
export interface Models<TModels = any> {
	[key: string]: Model<any, any, TModels>
}

export interface NamedModel<
	TState = any,
	TBaseState = TState,
	TModels = Models
> extends Model<TState, TBaseState, TModels> {
	name: string
	reducers: ModelReducers<TState>
}

export interface Model<TState = any, TBaseState = TState, TModels = Models> {
	name?: string
	state: TState
	reducers?: ModelReducers<TState>
	baseReducer?: ReduxReducer<TBaseState>
	effects?: ModelEffects | ModelEffectsCreator<TModels>
}

export type ModelReducers<TState = any> = {
	[key: string]: Reducer<TState>
}

export interface ModelEffects {
	[key: string]: ModelEffect
}

export type ModelEffect = <TModels extends Models>(
	payload: Action['payload'],
	rootState: RematchRootState<TModels>
) => any

export type ModelEffectsCreator<TModels> = (
	dispatch: RematchDispatch<TModels>
) => ModelEffects

/** ************************** Plugin *************************** */

export interface PluginConfig<TExposedModels extends Models> {
	models?: TExposedModels
	redux?: InitConfigRedux
}

export interface Plugin<TExposedModels extends Models = any>
	extends PluginHooks {
	config?: PluginConfig<TExposedModels>
	exposed?: PluginExposed
}

export interface PluginHooks {
	onStoreCreated?: StoreCreatedHook
	onModel?: ModelHook
	onReducer?: ReducerHook
	onRootReducer?: RootReducerHook
	createMiddleware?: MiddlewareCreator
}

export type ModelHook = (model: NamedModel, rematch: RematchStore<any>) => void

export type ReducerHook = (
	reducer: ReduxReducer,
	modelName: string,
	rematch: RematchBag
) => ReduxReducer | void

export type RootReducerHook = (
	reducer: ReduxReducer,
	rematch: RematchBag
) => ReduxReducer | void

export type StoreCreatedHook<TModels extends Models = any> = (
	store: RematchStore<TModels>,
	rematch: RematchBag
) => RematchStore<TModels> | void

export type MiddlewareCreator = (rematch: RematchBag) => Middleware

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
export interface RematchBag {
	models: NamedModel[]
	reduxConfig: ConfigRedux
	forEachPlugin: <Hook extends keyof PluginHooks>(
		method: Hook,
		fn: (content: NonNullable<PluginHooks[Hook]>) => void
	) => void
	effects: ModelEffects
}

/**
 * Initial, optional configuration provided by the user which describes how
 * Rematch store should be configured.
 */
export interface InitConfig<TModels> {
	name?: string
	models?: TModels
	plugins?: Plugin[]
	redux?: InitConfigRedux
}

/**
 * Config created out of the InitConfig by filling in missing properties with
 * default values and merging in modifications required by plugins
 * (new models, etc.).
 */
export interface Config<TModels> extends InitConfig<TModels> {
	name: string
	models: TModels
	plugins: Plugin[]
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

export interface RematchStore<TModels extends Models>
	extends ReduxStore<RematchRootState<TModels>, Action> {
	name: string
	dispatch: RematchDispatch<TModels>
	addModel: (model: NamedModel) => void
}

/** ************************** Root State *************************** */

/**
 * The type of state held by a store.
 */
export type RematchRootState<TModels> = ExtractRematchStateFromModels<TModels>

/**
 * A mapping from each model's name to a type of state it holds.
 */
export type ExtractRematchStateFromModels<TModels> = {
	[modelKey in keyof TModels]: TModels[modelKey] extends Model<
		any,
		any,
		TModels
	>
		? TModels[modelKey]['state']
		: never
}

/** ************************** Dispatch *************************** */

/**
 * Rematch dispatch is a combination of regular redux dispatch method and
 * an object allowing to dispatch specific actions by calling it the form of
 * dispatch[modelName][reducerName | effectName](payload).
 */
export type RematchDispatch<TModels> = ReduxDispatch &
	ExtractRematchDispatchersFromModels<TModels>

/**
 * Goes over all models and extracts from each a type for dispatcher object
 * created by Rematch.
 */
export type ExtractRematchDispatchersFromModels<TModels> = {
	[modelKey in keyof TModels]: TModels[modelKey] extends Model<
		any,
		any,
		TModels
	>
		? ModelDispatcher<TModels[modelKey], TModels>
		: never
}

/**
 * Combines together types extracted from reducers and effects for a model.
 */
export type ModelDispatcher<
	TModel extends Model<any, any, TModels>,
	TModels
> = ExtractRematchDispatchersFromReducers<TModel['state'], TModel['reducers']> &
	ExtractRematchDispatchersFromEffects<TModel['effects'], TModels>

/** ************************ Reducers Dispatcher ************************* */

/**
 * Extracts a dispatcher for each reducer that is defined for a model.
 */
export type ExtractRematchDispatchersFromReducers<
	TState,
	TReducers extends Model<TState>['reducers']
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
 * - reducer taking both state and payload -> dispatcher accepting payload as an
 *   argument
 */
export type ExtractRematchDispatcherFromReducer<
	TState,
	TReducer
> = TReducer extends () => any
	? RematchDispatcher
	: TReducer extends (state: TState) => TState
	? RematchDispatcher
	: TReducer extends (state: TState, payload: infer TPayload) => TState
	? RematchDispatcher<TPayload>
	: never

/**
 * When payload is of type void, it describes 'empty' dispatcher - meaning
 * it's a function not taking any arguments and returning an action.
 * Otherwise, it describes dispatcher which accepts one argument (payload)
 * and returns an action.
 */
export type RematchDispatcher<TPayload = void> = [TPayload] extends [void]
	? (() => Action<void>) & { isEffect: false }
	: ((payload: TPayload) => Action<TPayload>) & { isEffect: false }

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
	TEffects extends Model<any, any, TModels>['effects'],
	TModels
> = TEffects extends (...args: any[]) => infer R
	? R extends ModelEffects
		? ExtractRematchDispatchersFromEffectsObject<R>
		: never
	: TEffects extends ModelEffects
	? ExtractRematchDispatchersFromEffectsObject<TEffects>
	: void

/**
 * Extracts a dispatcher for each effect that is defined for a model.
 */
export type ExtractRematchDispatchersFromEffectsObject<
	TEffects extends ModelEffects
> = {
	[effectKey in keyof TEffects]: ExtractRematchDispatcherFromEffect<
		TEffects[effectKey]
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
	TEffect extends ModelEffect
> = TEffect extends () => infer TReturn
	? EffectRematchDispatcher<TReturn>
	: TEffect extends (payload: infer TPayload) => infer TReturn
	? EffectRematchDispatcher<TReturn, TPayload>
	: TEffect extends (payload: infer TPayload, state: any) => infer TReturn
	? EffectRematchDispatcher<TReturn, TPayload>
	: never

/**
 * When payload is of type void, it describes 'empty' dispatcher - meaning
 * it's a function not taking any arguments and returning an action.
 * Otherwise, it describes dispatcher which accepts one argument (payload)
 * and returns an action.
 */
export type EffectRematchDispatcher<TReturn = any, TPayload = void> = [
	TPayload
] extends [void]
	? (() => TReturn) & { isEffect: true }
	: ((payload: TPayload) => TReturn) & { isEffect: true }

export interface DevtoolOptions {
	disabled?: boolean
	[key: string]: any
}

declare module 'redux' {
	export interface Dispatch<A extends Action = AnyAction> {
		[modelName: string]: any
	}
}

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any
	}
}
