// Type definitions for Rematch v0.4.0
// Project: Rematch
// Definitions by: Shawn McKay https://github.com/shmck

import * as Redux from 'redux'

export as namespace rematch

export type RematchDispatch = {
  [key: string]: {
    [key:string]: (action: Action) => Promise<Redux.Dispatch<any>>
  }
} | ((action: Action) => Promise<Redux.Dispatch<any>>)

export let dispatch: RematchDispatch;
export function init(config: Config | undefined): Redux.Store<any>

export namespace rematch {
  export let dispatch: RematchDispatch;
  export function init(config: InitConfig): Redux.Store<any>
}

export interface RematchStore {
  replaceReducer(nextReducer: any): void,
  dispatch(action: Action): void,
  getState(): any,
  model?: (model: Model) => void,
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
  [key: string]: Model,
}

export type ModelHook = (model: Model) => void

export type Validation = [boolean | undefined, string]

export type Exposed = {
  dispatch: Redux.Dispatch<any> | { [key: string]: () => void },
  effects: any,
  createDispatcher: (modelName: string, reducerName: string) => any,
  validate: (validations: Validation[]) => void,
  [key: string]: any,
}

export interface Model {
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

export interface Plugin {
  config?: InitConfig,
  exposed?: {
    [key: string]: any,
  },
  onInit?: () => void,
  onStoreCreated?: (store: Redux.Store<any>) => void,
  onModel?: ModelHook,
  middleware?: <S>(store: Redux.MiddlewareAPI<S>) => (next: Redux.Dispatch<S>) => (action: Action) => any,
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

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any,
  }
}
