/*
 * Type definitions for Rematch v2.0.0
 * Project: Rematch
 * Definitions by:
 * Shawn McKay https://github.com/shmck
 * Bruno Lemos https://github.com/brunolemos
 * Przemyslaw Jamrozowicz https://github.com/pjamrozowicz
 */

import * as Redux from 'redux'

export interface Action<P = any> extends Redux.Action<string> {
	payload?: P
}

export interface EffectAction<P = any, R = undefined> extends Action<P> {
	result: R
}

export type Reducer<S = any, A extends Action = Action> = (
	state: S,
	payload?: A['payload']
) => S

/** ************************** Model *************************** */

/**
 * Mapping from a model key to model object.
 */
export type Models<K extends string = string> = {
	[key in K]: Model<any, any, K>
}

export interface NamedModel<S = any, SS = S, K extends string = string>
	extends Model<S, SS, K> {
	name: string
}

export interface Model<S = any, SS = S, K extends string = string> {
	name?: string
	state: S
	reducers: ModelReducers<S>
	baseReducer?: Redux.Reducer<SS>
	effects?: ModelEffects<any> | ModelEffectsCreator<K>
}

export type ModelReducers<S = any> = {
	[key: string]: Reducer<S>
}

export type ModelEffects<RootState extends object> = {
	[key: string]: ModelEffect<RootState>
}

export type ModelEffect<
	RootState extends object,
	R = any,
	A extends Action = Action
> = (payload: A['payload'], rootState: RootState) => R

export type ModelEffectsCreator<K extends string> = <
	M extends object = Models<K>
>(
	dispatch: RematchDispatch<M>
) => ModelEffects<RematchRootState<M>>

/** ************************** Plugin *************************** */

export interface Plugin<M extends object = Models> extends PluginHooks<M> {
	config?: InitConfig<M>
	exposed?: PluginExposed<M>
}

export interface PluginHooks<M extends object = Models<any>> {
	onStoreCreated?: StoreCreatedHook<M>
	onModel?: ModelHook<M>
	onReducer?: ReducerHook<M>
	onRootReducer?: RootReducerHook<M>
	createMiddleware?: MiddlewareCreator
}

export type ModelHook<M extends object = Models<any>> = (
	model: NamedModel<any, any, any>,
	rematch: RematchStore<M>
) => void

export type ReducerHook<M extends object = Models<any>> = (
	reducer: Redux.Reducer,
	modelName: string,
	rematch: RematchBag<M>
) => Redux.Reducer | void

export type RootReducerHook<M extends object = Models<any>> = (
	reducer: Redux.Reducer,
	rematch: RematchBag<M>
) => Redux.Reducer | void

export type StoreCreatedHook<M extends object = Models<any>> = (
	store: RematchStore<M>,
	rematch: RematchBag<M>
) => RematchStore<M> | void

export type MiddlewareCreator = <M extends Models<any>>(
	rematch: RematchBag<M>
) => Redux.Middleware

export type ObjectNotAFunction = { [k: string]: any } & (
	| { bind?: never }
	| { call?: never }
)

export type PluginExposed<M extends object = Models> = M extends Models<any>
	? {
			[key: string]: ExposedFunction<M> | ObjectNotAFunction
	  }
	: never

export type ExposedFunction<M extends Models<any>> = (
	rematch: RematchStore<M>,
	...args: any
) => any

/** ************************** Rematch *************************** */

/**
 * Object for storing information needed for the Rematch store to run.
 * Purposefully hidden from the end user.
 */
export interface RematchBag<M extends object = Models> {
	models: NamedModel[]
	reduxConfig: ConfigRedux
	forEachPlugin: <Key extends keyof PluginHooks<M>>(
		method: Key,
		fn: (content: NonNullable<PluginHooks<M>[Key]>) => void
	) => void
	effects: ModelEffects<RematchRootState<M>>
}

/**
 * Initial, optional configuration provided by the user which describes how
 * Rematch store should be configured. Also used by Plugins.
 */
export interface InitConfig<M extends object = Models> {
	name?: string
	models?: M
	plugins?: Plugin<M>[]
	redux?: InitConfigRedux
}

/**
 * Config created out of the InitConfig by filling in missing properties with
 * default values and merging in modifications required by plugins
 * (new models, etc.).
 */
export interface Config<M extends object = Models> extends InitConfig<M> {
	name: string
	models: M
	plugins: Plugin<M>[]
	redux: ConfigRedux
}

/** ************************** Rematch-Redux *************************** */

/**
 * Initial, optional configuration for Redux, provided by the user. It allows
 * to gain full control over the way Redux is configured by Rematch and
 * override any defaults.
 */
export interface InitConfigRedux<S = any> {
	initialState?: S
	reducers?: ModelReducers<S>
	enhancers?: Redux.StoreEnhancer[]
	middlewares?: Redux.Middleware[]
	rootReducers?: Redux.ReducersMapObject<S, Action>
	combineReducers?: (
		reducers: Redux.ReducersMapObject<S, Action>
	) => Redux.Reducer<S>
	createStore?: Redux.StoreCreator
	devtoolOptions?: DevtoolOptions
}

/**
 * Config created out of InitConfigRedux by supplying default values in place
 * of missing properties.
 */
export interface ConfigRedux<S = any> extends InitConfigRedux<S> {
	reducers: ModelReducers<S>
	enhancers: Redux.StoreEnhancer[]
	middlewares: Redux.Middleware[]
	rootReducers: Redux.ReducersMapObject<S, Action>
}

export interface RematchStore<M extends object = Models>
	extends Redux.Store<RematchRootState<M>, Action> {
	name: string
	replaceReducer: (
		nextReducer: Redux.Reducer<RematchRootState<M>, Action>
	) => void
	dispatch: RematchDispatch<M>
	addModel: (model: NamedModel<any, any, Extract<keyof M, string>>) => void
}

/** ************************** Root State *************************** */

/**
 * The type of state held by a store.
 */
export type RematchRootState<
	M extends object = Models
> = ExtractRematchStateFromModels<M>

/**
 * A mapping from each model's name to a type of state it holds.
 */
export type ExtractRematchStateFromModels<M> = {
	[modelKey in keyof M]: M[modelKey] extends Model
		? M[modelKey]['state']
		: never
}

/** ************************** Dispatch *************************** */

/**
 * Rematch dispatch is a combination of regular redux dispatch method and
 * an object allowing to dispatch specific actions by calling it the form of
 * dispatch[modelName][reducerName | effectName](payload).
 */
export type RematchDispatch<M extends object = Models> = Redux.Dispatch<
	Action
> &
	ExtractRematchDispatchersFromModels<M>

/**
 * Goes over all models and extracts from each a type for dispatcher object
 * created by Rematch.
 */
export type ExtractRematchDispatchersFromModels<M> = {
	[modelKey in keyof M]: M[modelKey] extends Model
		? ExtractRematchDispatchersFromModel<M[modelKey]>
		: never
}

/**
 * Combines together types extracted from reducers and effects for a model.
 */
export type ExtractRematchDispatchersFromModel<
	M extends Model
> = ExtractRematchDispatchersFromReducers<M['state'], M['reducers']> &
	ExtractRematchDispatchersFromEffects<M['state'], M['effects']>

/** ************************ Reducers Dispatcher ************************* */

/**
 * Extracts a dispatcher for each reducer that is defined for a model.
 */
export type ExtractRematchDispatchersFromReducers<
	S,
	reducers extends Model<S>['reducers']
> = {
	[reducerKey in keyof reducers]: ExtractRematchDispatcherFromReducer<
		S,
		reducers[reducerKey]
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
	S,
	reducer
> = reducer extends () => any
	? RematchDispatcher
	: reducer extends (state: S) => S
	? RematchDispatcher
	: reducer extends (state: S, payload: infer P) => S
	? RematchDispatcher<P>
	: never

/**
 * When (P)ayload is of type void, it describes 'empty' dispatcher - meaning
 * it's a function not taking any arguments and returning an action.
 * Otherwise, it describes dispatcher which accepts one argument - payload
 * and also returns an action.
 */
export type RematchDispatcher<P = void> = [P] extends [void]
	? () => Action<P>
	: (payload: P) => Action<P>

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
	S,
	effects extends Model<S>['effects']
> = effects extends (...args: any[]) => infer R
	? R extends ModelEffects<any>
		? ExtractRematchDispatchersFromEffectsObject<R>
		: never
	: effects extends ModelEffects<any>
	? ExtractRematchDispatchersFromEffectsObject<effects>
	: {}

/**
 * Extracts a dispatcher for each effect that is defined for a model.
 */
export type ExtractRematchDispatchersFromEffectsObject<
	effects extends ModelEffects<any>
> = {
	[effectKey in keyof effects]: ExtractRematchDispatcherFromEffect<
		effects[effectKey]
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
	effect extends ModelEffect<any>
> = effect extends () => infer R
	? EffectRematchDispatcher<R>
	: effect extends (payload: infer P) => infer R
	? EffectRematchDispatcher<R, P>
	: effect extends (payload: infer P, state: any) => infer R
	? EffectRematchDispatcher<R, P>
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
export type EffectRematchDispatcher<R = any, P = void> = [P] extends [void]
	? (() => EffectAction<void, R>) & { isEffect: true }
	: ((payload: P) => EffectAction<P, R>) & { isEffect: true }

export interface DevtoolOptions {
	disabled?: boolean
	[key: string]: any
}

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any
	}
}
