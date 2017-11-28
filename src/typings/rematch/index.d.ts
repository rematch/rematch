// Type definitions for Rematch v0.1.0-beta.5
// Project: Rematch
// Definitions by: Shawn McKay https://github.com/shmck

import { Dispatch, Middleware, Reducer, Store } from 'redux'

export as namespace rematch

export function dispatch(action: Action): Promise<Dispatch<any>>
export function getStore(): Store<any>
export function init(config: Config): void
export function model(model: Model): void

export namespace rematch {
  export function dispatch(action: Action): Promise<Dispatch<any>>
  export function getStore(): Store<any>
  export function init(config: Config): void
  export function model(model: Model): void
}

export type Action = {
  type: string,
  payload?: any,
  meta?: any,
}

export type Reducers = {
  [key: string]: Reducer<any>,
}

export type ModelHook = (model: Model) => void

type GetState = () => Store<any>

export type Validation = [boolean, string]

export type Exposed = {
  dispatch?: Dispatch<any>,
  effects?: Dispatch<any>,
  createDispatcher?: (modelName: string, reducerName: string) => any,
  validate?: (validations: Validation[]) => void,
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
  onStoreCreated?: (getState: GetState) => void,
  onModel?: ModelHook,
  model?: Model,
  middleware?: (store: Store<any>) => (next: (action: Action) => any) => (action: Action) => any,
}

export interface PluginCreator {
  config?: Config,
  expose?: any,
  init?: (exposed: any) => Plugin
}

export interface ConfigRedux {
  initialState?: any,
  reducers?: {
    [key: string]: Reducer<any>,
  },
  middlewares?: Middleware[],
  combineReducers?: (Reducers) => Reducer<any>,
  createStore?: (Reducer, any, Middleware) => Store<any>,
  devtoolOptions?: Object,
}

export interface Config {
  models?: {
    [key: string]: Model,
  },
  plugins?: PluginCreator[],
  redux?: ConfigRedux,
}