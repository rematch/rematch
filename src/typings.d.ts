// Type definitions for Rematch v0.4.0
// Project: Rematch
// Definitions by:
// Shawn McKay https://github.com/shmck
// Bruno Lemos https://github.com/brunolemos

import * as Redux from 'redux'

export as namespace rematch

export type ExtractRematchStateFromModels<M extends Models> = {
  [modelKey in keyof M]: M[modelKey]['state']
}

export type RematchRootState<M extends Models> = ExtractRematchStateFromModels<M>

export type ExtractRematchDispatcherAsyncFromEffect<E> =
  E extends () => Promise<void> ? RematchDispatcherAsync<void, void> :
  E extends (payload: infer P) => Promise<void> ? RematchDispatcherAsync<P, void> :
  E extends (payload: infer P, meta: infer M) => Promise<void> ? RematchDispatcherAsync<P, M> :
  RematchDispatcherAsync<any, any>

export type ExtractRematchDispatchersFromEffectsObject<effects extends ModelEffects<any>> = {
  [effectKey in keyof effects]: ExtractRematchDispatcherAsyncFromEffect<effects[effectKey]>
}

export type ExtractRematchDispatchersFromEffects<effects extends ModelConfig['effects']> = 
  (effects extends ((...args: any[]) => infer R)
    ? R extends ModelEffects<any>
      ? ExtractRematchDispatchersFromEffectsObject<R>
      : {}
    : effects extends ModelEffects<any>
      ? ExtractRematchDispatchersFromEffectsObject<effects>
      : {})

export type ExtractRematchDispatcherFromReducer<R> =
  R extends () => any ? RematchDispatcher<void, void> :
  R extends (state: infer S) => infer S ? RematchDispatcher<void, void> :
  R extends (state: infer S, payload: infer P) => infer S ? RematchDispatcher<P, void> :
  R extends (state: infer S, payload: infer P, meta: infer M) => infer S ? RematchDispatcher<P, M> :
  RematchDispatcher<any, any>

export type ExtractRematchDispatchersFromReducersObject<reducers extends ModelReducers<any>> = {
  [reducerKey in keyof reducers]: ExtractRematchDispatcherFromReducer<reducers[reducerKey]>
}

export type ExtractRematchDispatchersFromReducers<reducers extends ModelConfig['reducers']> =
  ExtractRematchDispatchersFromReducersObject<reducers & {}>

export type ExtractRematchDispatchersFromModel<M extends ModelConfig> = 
  ExtractRematchDispatchersFromReducers<M['reducers']> &
  ExtractRematchDispatchersFromEffects<M['effects']>

export type ExtractRematchDispatchersFromModels<M extends Models> = {
  [modelKey in keyof M]: ExtractRematchDispatchersFromModel<M[modelKey]>
}

export type ExtractRematchSelectorsFromModels<M extends Models, RootState = any> = {
  [modelKey in keyof M]: {
    [reducerKey in keyof M[modelKey]['selectors']]:
    (state: RematchRootState<M>, ...args: any[]) =>
      M[modelKey]['selectors'][reducerKey] extends ((...args: any[]) => any)
        ? ReturnType<M[modelKey]['selectors'][reducerKey]>
        : {}
  }
}

export type RematchDispatcher<P = void, M = void> =
  ((action: Action<P, M>) => Redux.Dispatch<Action<P, M>>) &
  ((action: Action<P, void>) => Redux.Dispatch<Action<P, void>>) &
  (P extends void ? ((...args: any[]) => Action<any, any>) :
    M extends void ? ((payload: P) => Action<P, void>) :
    (payload: P, meta: M) => Action<P, M>)

export type RematchDispatcherAsync<P = void, M = void> =
  ((action: Action<P, M>) => Promise<Redux.Dispatch<Action<P, M>>>) &
  ((action: Action<P, void>) => Promise<Redux.Dispatch<Action<P, void>>>) &
  (P extends void ? ((...args: any[]) => Promise<Action<any, any>>) :
    M extends void ? ((payload: P) => Promise<Action<P, void>>) :
    (payload: P, meta: M) => Promise<Action<P, M>>)

export type RematchDispatch<M extends Models | void = void> =
  (M extends Models
    ? ExtractRematchDispatchersFromModels<M>
    : {
      [key: string]: {
        [key: string]: RematchDispatcher | RematchDispatcherAsync;
      }
    })
  & (RematchDispatcher | RematchDispatcherAsync)
  & (Redux.Dispatch<any>) // for library compatability

export function init<M extends Models>(
  config: InitConfig<M> | undefined,
): RematchStore<M>

export function getDispatch<M extends Models>(): RematchDispatch<M>

export function createModel<S = any>(
  model: ModelConfig<S>,
): ModelConfig<S>
export function createModel<S = any, M extends ModelConfig<S> = ModelConfig>(
  model: M,
): M

export namespace rematch {
  export function init<M extends Models>(config: InitConfig<M> | undefined): RematchStore<M>
}

export interface RematchStore<M extends Models = Models, A extends Action = Action>
  extends Redux.Store<RematchRootState<M>, A> {
  name: string,
  replaceReducer(nextReducer: Redux.Reducer<RematchRootState<M>, A>): void,
  dispatch: RematchDispatch<M>,
  getState(): RematchRootState<M>,
  model(model: Model): void,
  subscribe(listener: () => void): Redux.Unsubscribe,
}

export type Action<P = any, M = any> = {
  type: string,
  payload?: P,
  meta?: M
}

export type EnhancedReducer<S, P = object, M = object> = (state: S, payload: P, meta: M) => S;

export type EnhancedReducers = {
  [key: string]: EnhancedReducer<any>,
};

export type ModelReducers<S = any> = {
  [key: string]: (state: S, payload: any, meta?: any) => S,
}

type ModelEffects<S> = {
  [key: string]: (
    this: { [key: string]: (payload?: any, meta?: any) => Action<any, any> },
    payload: any,
    rootState: S
  ) => void
}

export type Models = {
  [key: string]: ModelConfig,
}

export type ModelHook = (model: Model) => void

export type Validation = [boolean | undefined, string]

export interface Model<S = any, SS = S> extends ModelConfig {
  name: string,
  reducers: ModelReducers<S>,
}

export interface ModelConfig<S = any, SS = S> {
  name?: string,
  state: S,
  baseReducer?: (state: SS, action: Action) => SS,
  reducers?: ModelReducers<S>,
  effects?: ModelEffects<any> | ((dispatch: RematchDispatch, getState:()=>RematchRootState<any>) => ModelEffects<any>),
  selectors?: {
    [key: string]: (state: SS, ...args: any[]) => any,
  },
  subscriptions?: {
    [matcher: string]: (action: Action) => void,
  },
}

export interface PluginFactory extends Plugin {
  create(plugin: Plugin): Plugin,
}

export interface Plugin<M extends Models = Models, A extends Action = Action> {
  config?: InitConfig<M>,
  onInit?: () => void,
  onStoreCreated?: (store: RematchStore<M, A>) => void,
  onModel?: ModelHook,
  middleware?: Middleware,

  // exposed
  exposed?: {
    [key: string]: any,
  },
  validate?(validations: Validation[]): void,
  storeDispatch?(action: Action, state: any): Redux.Dispatch<any> | undefined,
  storeGetState?(): any,
  dispatch?: RematchDispatch<M>,
  effects?: Object,
  createDispatcher?(modelName: string, reducerName: string): void,
}

export interface RootReducers {
  [type: string]: Redux.Reducer<any, Action>,
}

export interface DevtoolOptions {
  disabled?: boolean,
  [key: string]: any,
}

export interface InitConfigRedux<S = any> {
  initialState?: S,
  reducers?: ModelReducers,
  enhancers?: Redux.StoreEnhancer<any>[],
  middlewares?: Middleware[],
  rootReducers?: RootReducers,
  combineReducers?: (reducers: Redux.ReducersMapObject) => Redux.Reducer<any, Action>,
  createStore?: Redux.StoreCreator,
  devtoolOptions?: DevtoolOptions,
}

export interface InitConfig<M extends Models = Models> {
  name?: string,
  models?: M,
  plugins?: Plugin[],
  redux?: InitConfigRedux,
}

export interface Config<M extends Models = Models> extends InitConfig {
  name: string,
  models: M,
  plugins: Plugin[],
  redux: ConfigRedux,
}

export interface Middleware<DispatchExt = {}, S = any, D extends Redux.Dispatch = Redux.Dispatch> {
  (api: Redux.MiddlewareAPI<D, S>): (next: Redux.Dispatch<Action>) => (action: any, state?: any) => any;
}

export interface ConfigRedux {
  initialState?: any,
  reducers: ModelReducers,
  enhancers: Redux.StoreEnhancer<any>[],
  middlewares: Middleware[],
  rootReducers?: RootReducers,
  combineReducers?: (reducers: Redux.ReducersMapObject) => Redux.Reducer<any, Action>,
  createStore?: Redux.StoreCreator,
  devtoolOptions?: DevtoolOptions,
}

export interface RematchClass {
  config: Config,
  models: Model[],
  addModel(model: Model): void,
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any,
  }
}
