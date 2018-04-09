// Type definitions for Rematch v0.4.0
// Project: Rematch
// Definitions by: Shawn McKay https://github.com/shmck

import * as Redux from 'redux'

export as namespace rematch

export interface RematchDispatcher {
  (action: Action): Promise<Redux.Dispatch<any>>;
  (payload?: any): any;
}

export type RematchDispatch = {
  [key: string]: {
    [key:string]: RematchDispatcher;
  }
} & ((action: Action) => Promise<Redux.Dispatch<any>>)

export let dispatch: RematchDispatch;
export function init(config: InitConfig | undefined): Redux.Store<any>

export namespace rematch {
  export let dispatch: RematchDispatch;
  export function init(config: InitConfig | undefined): Redux.Store<any>
}

export interface RematchStore {
  replaceReducer(nextReducer: Redux.Reducer): void,
  dispatch: (action: Action) => Redux.Dispatch<Action>,
  getState(): any,
  model: (model: Model) => void,
  subscribe(listener: () => void): void,
}

export type Action = {
  type: string,
  payload?: any,
  meta?: any,
}

export type EnhancedReducer<S> = (state: S, payload: object, meta: object) => S;

export type EnhancedReducers = {
  [key: string]: EnhancedReducer<any>,
}

export type Reducer<S> = (state: S, payload?: any) => S;

export type Reducers = {
  [key: string]: Reducer<any>,
}

export type Models = {
  [key: string]: Model | ModelConfig,
}

export type ModelHook = (model: Model) => void

export type Validation = [boolean | undefined, string]

export interface ModelConfig {
  name?: string,
  state: any,
  reducers?: Reducers,
  effects?: {
    [key: string]: (payload: any, state: any) => void,
  },
  selectors?: {
    [key: string]: (state: any, arg?: any) => any,
  },
  subscriptions?: {
    [matcher: string]: (action: Action) => void,
  },
}

export interface Model {
  name: string,
  state: any,
  reducers?: Reducers,
  effects?: {
    [key: string]: (payload: any, state: any) => void,
  },
  selectors?: {
    [key: string]: (state: any, arg?: any) => any,
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
  dispatch?: RematchDispatch,
  effects?: Object,
  createDispatcher?(modelName: string, reducerName: string): void,
}

export interface RootReducers {
  [type: string]: Reducer<any>,
}

export interface InitConfigRedux {
  initialState?: any,
  reducers?: Reducers,
  enhancers?: Redux.StoreEnhancer<any>[],
  middlewares?: Redux.Middleware[],
  rootReducers?: RootReducers,
  combineReducers?: (reducers: Redux.ReducersMapObject) => Reducer<any>,
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
  reducers: Reducers,
  enhancers: Redux.StoreEnhancer<any>[],
  middlewares: Redux.Middleware[],
  rootReducers?: RootReducers,
  combineReducers?: (reducers: Redux.ReducersMapObject) => Reducer<any>,
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
