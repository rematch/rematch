import { combineReducers, createStore, Dispatch, Middleware, Reducer } from 'redux'

export type Action = {
  type: string,
  payload?: any,
  meta?: any,
}

export type Reducers = {
  [key: string]: Reducer<any>,
}

export interface Model {
  name?: string,
  state: any,
  reducers?: Reducers,
  effects?: {
   [key: string]: (payload: any) => void,
  },
  selectors?: {
   [key: string]: (state: any, arg?: any) => any,
  },
  subscriptions?: {
   [matcher: string]: (action: Action) => void,
  },
 }
 
 export interface Plugin {
  onStoreCreated?: (getState) => void,
  onModel?: (model: Model, dispatch: Dispatch<any>) => void,
  model?: Model,
  middleware?: Middleware,
}

export interface PluginCreator {
  expose: {
    [key: string]: any,
  },
  config: Config,
  init: (exposed: Object) => Plugin
}

export interface ConfigRedux {
  initialState?: any,
  reducers?: {
    [key: string]: Reducer<any>,
  },
  middlewares?: Middleware[],
  combineReducers?: combineReducers<any>,
  createStore?: createStore,
  devtoolOptions?: Object,
}

export interface Config {
  models?: {
    [key: string]: Model,
  },
  plugins?: PluginCreator[],
  redux?: ConfigRedux,
 }
