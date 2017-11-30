// Type definitions for Rematch v0.1.0-beta.5
// Project: Rematch
// Definitions by: Shawn McKay https://github.com/shmck

import { Dispatch, MiddlewareAPI, Middleware, Reducer, Store, StoreCreator } from 'redux'

export as namespace rematch

export function dispatch(action: Action): Promise<Dispatch<any>>
export function getStore(): Store<any>
export function init(config: Config | undefined): void
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

export type Models = {
  [key: string]: Model,
}

export type ModelHook = (model: Model) => void

type GetStore = () => Store<any>

export type Validation = [boolean | undefined, string]

export type Exposed = {
  dispatch?: Dispatch<any>,
  effects?: any,
  createDispatcher?: (modelName: string, reducerName: string) => any,
  validate?: (validations: Validation[]) => void,
  [key: string]: any,
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
  onStoreCreated?: (getStore: GetStore) => void,
  onModel?: ModelHook,
  middleware?: <S>(store: MiddlewareAPI<S>) => (next: Dispatch<S>) => (action: Action) => any,
}

export interface PluginCreator {
  config?: Config,
  expose?: {
    [key: string]: any,
  },
  init?: (exposed: Exposed) => Plugin
}

export interface ConfigRedux {
  initialState?: any,
  reducers?: Reducers,
  middlewares?: Middleware[],
  combineReducers?: (Reducers) => Reducer<any>,
  createStore?: StoreCreator,
  devtoolOptions?: Object,
}

export interface Config {
  models?: Models,
  plugins?: PluginCreator[],
  redux?: ConfigRedux,
}