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

export type ExtractRematchDispatchersFromModels<M extends Models> = {
  [modelKey in keyof M]: {
    [reducerKey in keyof M[modelKey]['reducers']]:
      ExtractRematchDispatcherFromReducer<M[modelKey]['reducers'][reducerKey]>
  } & {
    [effectKey in keyof M[modelKey]['effects']]:
      ExtractRematchDispatcherAsyncFromEffect<M[modelKey]['effects'][effectKey]>
  }
}

export type ExtractRematchSelectorsFromModels<M extends Models, RootState = any> = {
  [modelKey in keyof M]: {
    [reducerKey in keyof M[modelKey]['selectors']]:
      (state: RematchRootState<M>, ...args:any[]) => ReturnType<M[modelKey]['selectors'][reducerKey]>
  }
}

export type RematchDispatcher<P = any, M = any> = {
  (action: Action<P, M>): Redux.Dispatch<Action<P, M>>;
}
  &
    P extends void ? { (): Action<void, void>; } :
    M extends void ? { (payload: P): Action<P, void>; } :
    { (payload: P, meta: M): Action<P, M>; }

export type RematchDispatcherAsync<P = any, M = any> = {
  (action: Action<P, M>): Promise<Redux.Dispatch<Action<P, M>>>;
}
  &
    P extends void ? { (): Promise<Action<void, void>>; } :
    M extends void ? { (payload?: P): Promise<Action<P, void>>; } :
    { (payload?: P, meta?: M): Promise<Action<P, M>>; }

export type RematchDispatch<M extends Models | void = void> =
  (M extends Models
    ? ExtractRematchDispatchersFromModels<M>
    : {
        [key: string]: {
          [key:string]: RematchDispatcher | RematchDispatcherAsync;
        }
    })
  & ((action: Action) => Promise<Redux.Dispatch<Action>>)
  & (Redux.Dispatch<any>) // for library compatability

export let dispatch: RematchDispatch<any>;
export function init(config: InitConfig | undefined): Redux.Store<any>

export namespace rematch {
  export let dispatch: RematchDispatch<any>;
  export function init(config: InitConfig | undefined): Redux.Store<any>
}

export interface RematchStore {
  replaceReducer(nextReducer: Redux.Reducer<any, Action>): void,
  dispatch(action: Action): RematchDispatch<any>,
  getState(): any,
  model(model: Model): void,
  subscribe(listener: () => void): void,
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

export type ModelHook = (model: Model) => void

export type Validation = [boolean | undefined, string]

export interface Model<S = any> {
  name?: string,
  state: S,
  reducers?: ModelReducers<S>,
  effects?: {
    [key: string]: (payload: any, rootState: any) => void,
  },
  selectors?: {
    [key: string]: (state: S, ...args: any[]) => any,
  },
  subscriptions?: {
    [matcher: string]: (action: Action) => void,
  },
}

export interface PluginFactory extends Plugin {
  create(plugin: Plugin): Plugin,
}

export interface Plugin {
  config?: InitConfig,
  onInit?: () => void,
  onStoreCreated?: (store: Redux.Store<any>) => void,
  onModel?: ModelHook,
  middleware?: <S>(store: Redux.MiddlewareAPI) => (next: Redux.Dispatch) => (action: Action) => any,

  // exposed
  exposed?: {
    [key: string]: any,
  },
  validate?(validations: Validation[]): void,
  storeDispatch?(action: Action): Redux.Dispatch<any> | undefined,
  dispatch?: RematchDispatch<any>,
  effects?: Object,
  createDispatcher?(modelName: string, reducerName: string): void,
}

export interface RootReducers {
  [type: string]: Redux.Reducer<any, Action>,
}

export interface InitConfigRedux {
  initialState?: any,
  reducers?: ModelReducers,
  enhancers?: Redux.StoreEnhancer<any>[],
  middlewares?: Redux.Middleware[],
  rootReducers?: RootReducers,
  combineReducers?: (reducers: Redux.ReducersMapObject) => Redux.Reducer<any, Action>,
  createStore?: Redux.StoreCreator,
  devtoolOptions?: Object,
}

export interface InitConfig {
  name?: string,
  models?: Models,
  plugins?: Plugin[],
  redux?: InitConfigRedux,
}

export interface Config {
  name: string,
  models: Models,
  plugins: Plugin[],
  redux: ConfigRedux,
}

export interface ConfigRedux {
  initialState?: any,
  reducers: ModelReducers,
  enhancers: Redux.StoreEnhancer<any>[],
  middlewares: Redux.Middleware[],
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
