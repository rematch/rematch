/*
 * Type definitions for Rematch v2.0.0
 * Project: Rematch
 * Definitions by:
 * Shawn McKay https://github.com/shmck
 * Bruno Lemos https://github.com/brunolemos
 * Przemyslaw Jamrozowicz https://github.com/pjamrozowicz
 */

import {
	// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
	// @ts-ignore
	AnyAction,
	Action as ReduxAction,
	Dispatch as ReduxDispatch,
	Reducer as ReduxReducer,
	ReducersMapObject,
	Middleware,
	StoreEnhancer,
	StoreCreator,
	Store as ReduxStore,
} from 'redux'

/**
 * Custom action interface adds an additional field - `payload`.
 *
 * Strings are used as the type for `type` field inherited from Redux, because
 * strings are serializable.
 *
 * @template P The type of the action's payload.
 */
export interface Action<TPayload = any> extends ReduxAction<string> {
	payload?: TPayload
}

/**
 * Custom reducer which instead of an action (like in Redux), accepts payload as
 * as a second argument. `payload` is extracted from action and passed to the
 * reducer, therefore it has the same type.
 *
 * @template S The type of state consumed and produced by this reducer.
 * @template A The type of actions the reducer can potentially respond to.
 */
export type Reducer<TState = any> = (
	state: TState,
	payload?: Action['payload']
) => TState

/** ************************** Model *************************** */

/**
 * Mapping from a model key to model object.
 */
export type Models<AllModelsKeys extends string = string> = {
	[key in AllModelsKeys]: Model<any, any, AllModelsKeys>
}

export interface NamedModel<
	TState = any,
	TBaseState = TState,
	AllModelsKeys extends string = string
> extends Model<TState, TBaseState, AllModelsKeys> {
	name: string
	reducers: ModelReducers<TState>
}

export interface Model<
	TState = any,
	TBaseState = TState,
	AllModelsKeys extends string = string
> {
	name?: string
	state: TState
	reducers?: ModelReducers<TState>
	baseReducer?: ReduxReducer<TBaseState>
	effects?:
		| ModelEffects<AllModelsKeys, TState>
		| ModelEffectsCreator<AllModelsKeys, TState>
}

export type ModelReducers<TState = any> = {
	[key: string]: Reducer<TState>
}

export type ModelEffects<AllModelsKeys extends string, TState> = {
	[key: string]: ModelEffect<AllModelsKeys, TState>
}

export type ModelEffect<AllModelsKeys extends string, TState> = <
	TModel extends Model<TState>,
	TModels extends object = Models<AllModelsKeys>
>(
	this: ModelDispatcher<TModel>,
	payload: Action['payload'],
	rootState: RematchRootState<TModels>
) => any

export type ModelEffectsCreator<AllModelsKeys extends string, TState> = <
	TModels extends object = Models<AllModelsKeys>
>(
	dispatch: RematchDispatch<TModels>
) => ModelEffects<AllModelsKeys, TState>

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

export type ModelHook = (
	model: NamedModel<any, any, any>,
	rematch: RematchStore<any>
) => void

export type ReducerHook = (
	reducer: ReduxReducer,
	modelName: string,
	rematch: RematchBag<any>
) => ReduxReducer | void

export type RootReducerHook = (
	reducer: ReduxReducer,
	rematch: RematchBag<any>
) => ReduxReducer | void

export type StoreCreatedHook<TModels extends Models = any> = (
	store: RematchStore<TModels>,
	rematch: RematchBag<TModels>
) => RematchStore<TModels> | void

export type MiddlewareCreator = (rematch: RematchBag<any>) => Middleware

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
export interface RematchBag<TModels extends object = Models> {
	models: NamedModel[]
	reduxConfig: ConfigRedux
	forEachPlugin: <Hook extends keyof PluginHooks>(
		method: Hook,
		fn: (content: NonNullable<PluginHooks[Hook]>) => void
	) => void
	effects: TModels extends Models<infer AllModelsKeys>
		? ModelEffects<AllModelsKeys, any>
		: never
}

/**
 * Initial, optional configuration provided by the user which describes how
 * Rematch store should be configured. Also used by Plugins.
 *
 * Plugins are not passed M models since M generic might actually be based
 * on a model created by plugins, which would cause type issues.
 */
export interface InitConfig<TModels extends Models> {
	name?: string
	models?: TModels
	plugins?: Plugin[]
	redux?: InitConfigRedux
}

/**
 * Config created out of the InitConfig by filling in missing properties with
 * default values and merging in modifications required by plugins
 * (new models, etc.).
 *
 * Plugins are not passed M models since M generic might actually be based
 * on a model created by plugins, which would cause type issues.
 */
export interface Config<TModels extends Models> extends InitConfig<TModels> {
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

export interface RematchStore<TModels extends object = Models>
	extends ReduxStore<RematchRootState<TModels>, Action> {
	name: string
	dispatch: RematchDispatch<TModels>
	addModel: (
		model: NamedModel<any, any, Extract<keyof TModels, string>>
	) => void
}

/** ************************** Root State *************************** */

/**
 * The type of state held by a store.
 */
export type RematchRootState<
	TModels extends object = Models
> = ExtractRematchStateFromModels<TModels>

/**
 * A mapping from each model's name to a type of state it holds.
 */
export type ExtractRematchStateFromModels<TModels> = {
	[modelKey in keyof TModels]: TModels[modelKey] extends Model
		? TModels[modelKey]['state']
		: never
}

/** ************************** Dispatch *************************** */

/**
 * Rematch dispatch is a combination of regular redux dispatch method and
 * an object allowing to dispatch specific actions by calling it the form of
 * dispatch[modelName][reducerName | effectName](payload).
 */
export type RematchDispatch<TModels extends object = Models> = ReduxDispatch<
	Action
> &
	ExtractRematchDispatchersFromModels<TModels>

/**
 * Goes over all models and extracts from each a type for dispatcher object
 * created by Rematch.
 */
export type ExtractRematchDispatchersFromModels<TModels> = {
	[modelKey in keyof TModels]: TModels[modelKey] extends Model
		? ModelDispatcher<TModels[modelKey]>
		: never
}

/**
 * Combines together types extracted from reducers and effects for a model.
 */
export type ModelDispatcher<
	TModel extends Model
> = ExtractRematchDispatchersFromReducers<TModel['state'], TModel['reducers']> &
	ExtractRematchDispatchersFromEffects<TModel['effects']>

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
 * When (P)ayload is of type void, it describes 'empty' dispatcher - meaning
 * it's a function not taking any arguments and returning an action.
 * Otherwise, it describes dispatcher which accepts one argument - payload
 * and also returns an action.
 */
export type RematchDispatcher<TPayload = void> = [TPayload] extends [void]
	? (() => Action<void>) & { isEffect: false }
	: ((payload: TPayload) => Action<TPayload>) & { isEffect: false }

/** ************************ Effects Dispatcher ************************* */

/**
 * Based on the shape of 'effects' property it extracts dispatchers from it.
 * 'effects' can be:
 * - empty - in this case the type is just empty object
 * - an object defining effects
 * - a function returning effects
 * If it's a function it infers its return type which must define effects.
 */
export type ExtractRematchDispatchersFromEffects<
	TEffects extends Model['effects']
> = TEffects extends (...args: any[]) => infer R
	? R extends ModelEffects<any, any>
		? ExtractRematchDispatchersFromEffectsObject<R>
		: never
	: TEffects extends ModelEffects<any, any>
	? ExtractRematchDispatchersFromEffectsObject<TEffects>
	: void

/**
 * Extracts a dispatcher for each effect that is defined for a model.
 */
export type ExtractRematchDispatchersFromEffectsObject<
	TEffects extends ModelEffects<any, any>
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
	TEffect extends ModelEffect<any, any>
> = TEffect extends () => infer TReturn
	? EffectRematchDispatcher<TReturn>
	: TEffect extends (payload: infer TPayload) => infer TReturn
	? EffectRematchDispatcher<TReturn, TPayload>
	: TEffect extends (payload: infer TPayload, state: any) => infer TReturn
	? EffectRematchDispatcher<TReturn, TPayload>
	: never

/**
 * When (P)ayload is of type void, it describes 'empty' dispatcher - meaning
 * it's a function not taking any arguments and returning an action.
 * Otherwise, it describes dispatcher which accepts one argument - payload
 * and also returns an action.
 *
 * The returned action differs from this in reducers, it contains extra fields:
 * - isEffect, which indicates that this action is coming from an effect
 * - result, which is the result of the effect, possibly a promise that user
 *   can await. It doesn't return a promise directly to make it compatible with
 *   Redux library, which is expecting an action object.
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

/**
 * Overload Redux types
 */
declare module 'redux' {
	export interface Dispatch<A extends Action = AnyAction> {
		<TReturnType = any, TPayload = any>(action: Action<TPayload>): TReturnType
	}
}

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any
	}
}
