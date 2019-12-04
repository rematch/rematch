/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * Type definitions for Rematch v2.0.0
 * Project: Rematch
 * Definitions by:
 * Shawn McKay https://github.com/shmck
 * Bruno Lemos https://github.com/brunolemos
 * Przemyslaw Jamrozowicz https://github.com/pjamrozowicz
 */

import * as Redux from 'redux'

export as namespace rematch

// re-export redux reducer for plugins to easily use it
export type ReduxReducer<S = any, A extends Action = Action> = (
	state: S | undefined,
	action: A
) => S

export interface Action<P = any, M = any, T = any> extends Redux.Action<T> {
	payload?: P
	meta?: M
}

export type Reducer<S = any, A extends Action = Action> = (
	state: S,
	payload?: A['payload'],
	meta?: A['meta']
) => S

export type Validation = [boolean | undefined, string]

/* model */
export interface Models {
	[key: string]: Model
}

export interface NamedModel<S = any, SS = S> extends Model<S, SS> {
	name: string
}

export interface Model<S = any, SS = S> {
	name?: string
	state: S
	reducers: ModelReducers<S>
	baseReducer?: Redux.Reducer<SS>
	effects?: ModelEffects | ModelEffectsCreator
}

export type ModelReducers<S = any> = {
	[key: string]: Reducer<S>
}

export type ModelEffects = {
	[key: string]: ModelEffect
}

export type ModelEffect<RootState = any, A extends Action = Action> = (
	payload: A['payload'],
	rootState: RootState,
	meta?: A['meta']
) => Promise<any> | any

export type ModelEffectsCreator = (dispatch: RematchDispatch) => ModelEffects

/* plugin */
export interface Plugin extends PluginHooks {
	config?: InitConfig
	exposed?: PluginExposed
}

export interface PluginHooks {
	onInit?: InitHook
	onStoreCreated?: StoreCreatedHook
	onModel?: ModelHook
	onReducer?: ReducerHook
	onRootReducer?: RootReducerHook
	createMiddleware?: MiddlewareCreator
}

export type InitHook = (rematch: Rematch) => void

export type ModelHook = (model: NamedModel, rematch: Rematch) => void

export type ReducerHook = (
	reducer: Redux.Reducer,
	modelName: string,
	rematch: Rematch
) => Redux.Reducer | void

export type RootReducerHook = (
	reducer: Redux.Reducer,
	rematch: Rematch
) => Redux.Reducer | void

export type MiddlewareCreator = (rematch: Rematch) => Redux.Middleware

export type StoreCreatedHook = (
	store: RematchStore,
	rematch: Rematch
) => RematchStore | void

type ObjectNotAFunction = { [k: string]: any } & (
	| { bind?: never }
	| { call?: never }
)

export type PluginExposed = {
	[key: string]: ExposedFunction | ObjectNotAFunction
}

export type ExposedFunction = (rematch: Rematch, ...args: any) => any

/* rematch */
export interface Rematch<M extends Models = Models> {
	config: Config
	validate: (validations: Validation[]) => void
	reducers: Redux.ReducersMapObject
	models: NamedModel[]
	forEachPlugin: <Key extends keyof PluginHooks>(
		method: Key,
		fn: (content: NonNullable<PluginHooks[Key]>) => void
	) => void
	addModels: (models: NamedModel[]) => void
	store?: RematchStore<M>
	// exposed/created in core plugins
	storeDispatch?: Redux.Dispatch
	storeGetState?: () => RematchRootState<M>
	createDispatcher?: (
		modelName: string,
		reducerName: string
	) => (payload?: any, meta?: any) => Action | Promise<Action>
	dispatch?: RematchDispatch<M>
	effects?: object
}

export interface InitConfig {
	name?: string
	models?: Models
	plugins?: Plugin[]
	redux?: InitConfigRedux
}

export interface Config extends InitConfig {
	name: string
	models: Models
	plugins: Plugin[]
	redux: ConfigRedux
}

/* rematch-redux */
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

export interface ConfigRedux<S = any> extends InitConfigRedux<S> {
	reducers: ModelReducers<S>
	enhancers: Redux.StoreEnhancer[]
	middlewares: Redux.Middleware[]
}

export interface RematchStore<
	M extends Models = Models,
	A extends Action = Action
> extends Redux.Store<RematchRootState<M>, A> {
	name: string
	replaceReducer: (nextReducer: Redux.Reducer<RematchRootState<M>, A>) => void
	dispatch: RematchDispatch<M>
	getState: () => RematchRootState<M>
	model: (model: Model) => void
	subscribe: (listener: () => void) => Redux.Unsubscribe
}

export type RematchRootState<
	M extends Models = Models
> = ExtractRematchStateFromModels<M>

export type ExtractRematchStateFromModels<M extends Models> = {
	[modelKey in keyof M]: M[modelKey]['state']
}

export type RematchDispatch<M extends Models | void = void> = (M extends Models
	? ExtractRematchDispatchersFromModels<M>
	: {
			[key: string]: {
				[key: string]: RematchDispatcher | RematchDispatcherAsync
			}
	  }) &
	(RematchDispatcher | RematchDispatcherAsync) &
	Redux.Dispatch<any> // for library compatibility

export type ExtractRematchDispatchersFromModels<M extends Models> = {
	[modelKey in keyof M]: ExtractRematchDispatchersFromModel<M[modelKey]>
}

export type ExtractRematchDispatchersFromModel<
	M extends Model
> = ExtractRematchDispatchersFromReducers<M['reducers']> &
	ExtractRematchDispatchersFromEffects<M['effects']>

export type ExtractRematchDispatchersFromReducers<
	reducers extends Model['reducers']
> = ExtractRematchDispatchersFromReducersObject<reducers & {}>

export type ExtractRematchDispatchersFromReducersObject<
	reducers extends ModelReducers
> = {
	[reducerKey in keyof reducers]: ExtractRematchDispatcherFromReducer<
		reducers[reducerKey]
	>
}

export type ExtractRematchDispatcherFromReducer<R> = R extends () => any
	? RematchDispatcher
	: R extends (state: infer S) => infer S
	? RematchDispatcher
	: R extends (state: infer S, payload: infer P) => infer S
	? RematchDispatcher<P>
	: R extends (state: infer S, payload: infer P, meta: infer M) => infer S
	? RematchDispatcher<P, M>
	: RematchDispatcher<any, any>

export type RematchDispatcher<P = void, M = void> = (P extends void
	? (...args: any[]) => Action
	: M extends void
	? (payload: P) => Action<P, void>
	: (payload: P, meta: M) => Action<P, M>) &
	((action: Action<P, M>) => Redux.Dispatch<Action<P, M>>)

export type ExtractRematchDispatchersFromEffects<
	effects extends Model['effects']
> = effects extends (...args: any[]) => infer R
	? R extends ModelEffects
		? ExtractRematchDispatchersFromEffectsObject<R>
		: {}
	: effects extends ModelEffects
	? ExtractRematchDispatchersFromEffectsObject<effects>
	: {}

export type ExtractRematchDispatchersFromEffectsObject<
	effects extends ModelEffects
> = {
	[effectKey in keyof effects]: AsyncOrNonAsyncRematchDispatcher<
		effects[effectKey]
	>
}

export type AsyncOrNonAsyncRematchDispatcher<
	E extends ModelEffect
> = E extends (...args: any[]) => Promise<any>
	? ExtractRematchDispatcherAsyncFromEffect<E>
	: ExtractRematchDispatcherNonAsyncFromEffect<E>

export type ExtractRematchDispatcherAsyncFromEffect<
	E
> = E extends () => Promise<any>
	? RematchDispatcherAsync
	: E extends (state: any) => Promise<any>
	? RematchDispatcherAsync
	: E extends (state: any, payload: infer P) => Promise<any>
	? RematchDispatcherAsync<P>
	: E extends (state: any, payload: infer P, meta: infer M) => Promise<any>
	? RematchDispatcherAsync<P, M>
	: RematchDispatcherAsync<any, any>

export type RematchDispatcherAsync<P = void, M = void> = (P extends void
	? (...args: any[]) => Promise<Action>
	: M extends void
	? (payload: P) => Promise<Action<P, void>>
	: (payload: P, meta: M) => Promise<Action<P, M>>) &
	((action: Action<P, M>) => Promise<Redux.Dispatch<Action<P, M>>>)

type ExtractRematchDispatcherNonAsyncFromEffect<E> = E extends () => void
	? RematchDispatcher
	: E extends (state: any) => void
	? RematchDispatcher
	: E extends (state: any, payload: infer P) => void
	? RematchDispatcher<P>
	: E extends (state: any, payload: infer P, meta: infer M) => void
	? RematchDispatcher<P, M>
	: RematchDispatcher<any, any>

export interface DevtoolOptions {
	disabled?: boolean
	[key: string]: any
}

/* others */
export function createModel<S = any, M extends Model = any>(model: M): M
export const init: (initConfig?: InitConfig) => RematchStore<Models, Action>

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any
	}
}
