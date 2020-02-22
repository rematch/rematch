/*
 * Type definitions for Rematch v1.1.0
 * Project: Rematch
 * Definitions by:
 * Shawn McKay https://github.com/shmck
 * Bruno Lemos https://github.com/brunolemos
 */

import * as Redux from 'redux'

export as namespace rematch

export type ExtractRematchStateFromModels<M> = {
	[modelKey in keyof M]: M[modelKey] extends ModelConfig ? M[modelKey]['state'] : never
}

export type RematchRootState<M> = ExtractRematchStateFromModels<M>

export type ExtractRematchDispatcherAsyncFromEffect<
	E
> = E extends () => Promise<infer R>
	? RematchDispatcherAsync<void, void, R>
	: E extends (payload: infer P) => Promise<infer R>
		? RematchDispatcherAsync<P, void, R>
		: RematchDispatcherAsync<any, any, any>

export type ExtractRematchDispatchersFromEffectsObject<effects extends ModelEffects<any>> = {
	[effectKey in keyof effects]: ExtractRematchDispatcherAsyncFromEffect<effects[effectKey]>
}

export type ExtractRematchDispatchersFromEffects<
	effects extends ModelConfig['effects']
> = effects extends ((...args: any[]) => infer R)
	? R extends ModelEffects<any>
		? ExtractRematchDispatchersFromEffectsObject<R>
		: {}
	: effects extends ModelEffects<any>
		? ExtractRematchDispatchersFromEffectsObject<effects>
		: {}

export type ExtractRematchDispatcherFromReducer<R> = R extends () => any
	? RematchDispatcher<void, void>
	: R extends (state: infer S) => infer S
		? RematchDispatcher<void, void>
		: R extends (state: infer S, payload: infer P) => infer S
			? RematchDispatcher<P, void>
			: R extends (state: infer S, payload: infer P, meta: infer M) => infer S
				? RematchDispatcher<P, M>
				: RematchDispatcher<any, any>

export type ExtractRematchDispatchersFromReducersObject<
	reducers extends ModelReducers<any>
> = {
	[reducerKey in keyof reducers]: ExtractRematchDispatcherFromReducer<
		reducers[reducerKey]
	>
}

export type ExtractRematchDispatchersFromReducers<
	reducers extends ModelConfig['reducers']
> = ExtractRematchDispatchersFromReducersObject<reducers & {}>

export type ExtractRematchDispatchersFromModel<
	M extends ModelConfig
> = ExtractRematchDispatchersFromReducers<M['reducers']> &
	ExtractRematchDispatchersFromEffects<M['effects']>

export type ExtractRematchDispatchersFromModels<M> = {
	[modelKey in keyof M]: M[modelKey] extends ModelConfig ? ExtractRematchDispatchersFromModel<M[modelKey]> : never
}

export type RematchDispatcher<P = void, M = void> = ([P] extends [void]
	? ((...args: any[]) => Action<any, any>)
	: [M] extends [void]
		? ((payload: P) => Action<P, void>)
		: (payload: P, meta: M) => Action<P, M>) &
	((action: Action<P, M>) => Redux.Dispatch<Action<P, M>>) &
	((action: Action<P, void>) => Redux.Dispatch<Action<P, void>>)

export type RematchDispatcherAsync<P = void, M = void, R = void> = ([P] extends [void]
	? ((...args: any[]) => Promise<R>)
	: [M] extends [void]
		? ((payload: P) => Promise<R>)
		: (payload: P, meta: M) => Promise<R>) &
	((action: Action<P, M>) => Promise<R>) &
	((action: Action<P, void>) => Promise<R>)

export type RematchDispatch<M = void> = ExtractRematchDispatchersFromModels<M> &
	(RematchDispatcher | RematchDispatcherAsync) &
	(Redux.Dispatch<any>) // for library compatability

export function init<M extends object>(
	config: InitConfig<M> | undefined
): RematchStore<M>

export function getDispatch<M extends Models>(): RematchDispatch<M>

export function createModel<S = any, M extends ModelConfig<S> = ModelConfig>(
	model: M
): M

export namespace rematch {
	export function init<M extends Models>(
		config: InitConfig<M> | undefined
	): RematchStore<M>
}

export interface RematchStore<
	M extends object = Models,
	A extends Action = Action
> extends Redux.Store<RematchRootState<M>, A> {
	name: string
	replaceReducer(nextReducer: Redux.Reducer<RematchRootState<M>, A>): void
	dispatch: RematchDispatch<M>
	getState(): RematchRootState<M>
	model(model: Model): void
	subscribe(listener: () => void): Redux.Unsubscribe
}

export type Action<P = any, M = any> = {
	type: string,
	payload?: P,
	meta?: M,
}

export type EnhancedReducer<S, P = object, M = object> = (
	state: S,
	payload: P,
	meta: M
) => S

export type EnhancedReducers = {
	[key: string]: EnhancedReducer<any>
}

export type ModelReducers<S = any> = {
	[key: string]: (state: S, payload: any, meta?: any) => S
}

type ModelEffects<S> = {
	[key: string]: (
		this: { [key: string]: (payload?: any, meta?: any) => Action<any, any> },
		payload: any,
		rootState: S
	) => void
}

export type Models<K extends string = string> = {
	[key in K]: ModelConfig
}

export type ModelHook = (model: Model) => void

export type Validation = [boolean | undefined, string]

export interface Model<S = any, SS = S> extends ModelConfig<S, SS> {
	name: string
	reducers: ModelReducers<S>
}

export interface ModelConfig<S = any, SS = S, K extends string = string> {
	name?: string
	state: S
	baseReducer?: (state: SS, action: Action) => SS
	reducers?: ModelReducers<S>
	effects?:
		| ModelEffects<any>
		| (<M extends Models<K> | void = void>(dispatch: RematchDispatch<M>) => ModelEffects<any>)
}

export interface PluginFactory extends Plugin {
	create(plugin: Plugin): Plugin
}

export interface Plugin<M extends Models = Models, A extends Action = Action> {
	config?: InitConfig<M>
	onInit?: () => void
	onStoreCreated?: (store: RematchStore<M, A>) => void
	onModel?: ModelHook
	middleware?: Middleware

	// exposed
	exposed?: {
		[key: string]: any
	}
	validate?(validations: Validation[]): void
	storeDispatch?(action: Action, state: any): Redux.Dispatch<any> | undefined
	storeGetState?(): any
	dispatch?: RematchDispatch<M>
	effects?: Object
	createDispatcher?(modelName: string, reducerName: string): void
}

export interface RootReducers {
	[type: string]: Redux.Reducer<any, Action>
}

export interface DevtoolOptions {
	disabled?: boolean
	[key: string]: any
}

export interface InitConfigRedux<S = any> {
	initialState?: S
	reducers?: ModelReducers
	enhancers?: Redux.StoreEnhancer<any>[]
	middlewares?: Middleware[]
	rootReducers?: RootReducers
	combineReducers?: (
		reducers: Redux.ReducersMapObject
	) => Redux.Reducer<any, Action>
	createStore?: Redux.StoreCreator
	devtoolOptions?: DevtoolOptions
}

export interface InitConfig<M extends object = Models> {
	name?: string
	models?: M
	plugins?: Plugin[]
	redux?: InitConfigRedux
}

export interface Config<M extends Models = Models> extends InitConfig {
	name: string
	models: M
	plugins: Plugin[]
	redux: ConfigRedux
}

export interface Middleware<
	DispatchExt = {},
	S = any,
	D extends Redux.Dispatch = Redux.Dispatch
> {
	(api: Redux.MiddlewareAPI<D, S>): (
		next: Redux.Dispatch<Action>
	) => (action: any, state?: any) => any
}

export interface ConfigRedux {
	initialState?: any
	reducers: ModelReducers
	enhancers: Redux.StoreEnhancer<any>[]
	middlewares: Middleware[]
	rootReducers?: RootReducers
	combineReducers?: (
		reducers: Redux.ReducersMapObject
	) => Redux.Reducer<any, Action>
	createStore?: Redux.StoreCreator
	devtoolOptions?: DevtoolOptions
}

export interface RematchClass {
	config: Config
	models: Model[]
	addModel(model: Model): void
}

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any
	}
}
