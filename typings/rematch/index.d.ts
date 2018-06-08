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

export type ExtractRematchDispatcherFromReducer<R> =
  R extends () => any ? RematchDispatcher<void, void> :
  R extends (state: infer S) => infer S ? RematchDispatcher<void, void> :
  R extends (state: infer S, payload: infer P) => infer S ? RematchDispatcher<P, void> :
  R extends (state: infer S, payload: infer P, meta: infer M) => infer S ? RematchDispatcher<P, M> :
  RematchDispatcher<any, any>

export type ExtractRematchDispatcherAsyncFromEffect<E> =
  E extends () => Promise<void> ? RematchDispatcherAsync<void, void> :
  E extends (payload: infer P) => Promise<void> ? RematchDispatcherAsync<P, void> :
  E extends (payload: infer P, meta: infer M) => Promise<void> ? RematchDispatcherAsync<P, M> :
  RematchDispatcherAsync<any, any>

export type ExtractRematchDispatchersFromModel<M extends Model> = {
  [reducerKey in keyof M['reducers']]:
  ExtractRematchDispatcherFromReducer<M['reducers'][reducerKey]>
} & {
    [effectKey in keyof M['effects']]:
    ExtractRematchDispatcherAsyncFromEffect<M['effects'][effectKey]>
  }

export type ExtractRematchDispatchersFromModels<M extends Models> = {
  [modelKey in keyof M]: ExtractRematchDispatchersFromModel<M[modelKey]>
}

export type ExtractRematchSelectorsFromModels<M extends Models, RootState = any> = {
  [modelKey in keyof M]: {
    [reducerKey in keyof M[modelKey]['selectors']]:
    (state: RematchRootState<M>, ...args: any[]) => ReturnType<M[modelKey]['selectors'][reducerKey]>
  }
}

export type RematchDispatcher<P = void, M = void> =
  ((action: Action<P, M>) => Redux.Dispatch<Action<P, M>>)
  &
  (P extends void ? () => Action<void, void> :
    M extends void ? (payload: P) => Action<P, void> :
    (payload: P, meta: M) => Action<P, M>)

export type RematchDispatcherAsync<P = void, M = void> =
  ((action: Action<P, M>) => Promise<Redux.Dispatch<Action<P, M>>>)
  &
  (P extends void ? () => Promise<Action<void, void>> :
    M extends void ? (payload?: P) => Promise<Action<P, void>> :
    (payload?: P, meta?: M) => Promise<Action<P, M>>)

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

export let dispatch: RematchDispatch<any>;
export function init<M extends Models>(
  config: InitConfig<M> | undefined,
): RematchStore<M>

export function getDispatch<M extends Models>(): RematchDispatch<M>

export function createModel<S = any, M extends Model<S> = Model>(
  model: M,
): M

export namespace rematch {
  export let dispatch: RematchDispatch<any>;
  export function init<M extends Models>(config: InitConfig<M> | undefined): RematchStore<M>
}

export interface RematchStore<M extends Models = Models, A extends Action = Action>
  extends Redux.Store<RematchRootState<M>, A> {
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

export type Models = {
  [key: string]: Model,
}

type Effects<S> = {
  [key: string]: (
    this: { [key: string]: (payload?: any, meta?: any) => Action<any, any> },
    payload: any,
    rootState: S
  ) => void
}

export type ModelHook = (model: Model) => void

export type Validation = [boolean | undefined, string]

export interface Model<S = any, SS = S> {
  name?: string,
  state: S,
  reducers?: ModelReducers<S>,
  effects?: Effects<S> & ((dispatch: RematchDispatch<any>) => Effects<S>),
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

export interface InitConfigRedux<S = any> {
  initialState?: S,
  reducers?: ModelReducers,
  enhancers?: Redux.StoreEnhancer<any>[],
  middlewares?: Middleware[],
  rootReducers?: RootReducers,
  combineReducers?: (reducers: Redux.ReducersMapObject) => Redux.Reducer<any, Action>,
  createStore?: Redux.StoreCreator,
  devtoolOptions?: Object,
}

export interface InitConfig<M extends Models = Models> {
  name?: string,
  models?: M,
  plugins?: Plugin[],
  redux?: InitConfigRedux,
}

export interface Config<M extends Models = Models> {
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
  devtoolOptions?: Object,
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
