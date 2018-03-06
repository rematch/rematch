// Type definitions for Rematch v0.4.0
// Project: Rematch
// Definitions by: Shawn McKay https://github.com/shmck

import { AnyAction, Dispatch, MiddlewareAPI, Middleware, ReducersMapObject, Store, StoreCreator, StoreEnhancer } from 'redux'

export as namespace rematch

export type RematchDispatch<S> = {
  [key: string]: {
    [key: string]: (action: Action) => Promise<Dispatch<S>>
  }
} | ((action: Action) => Promise<Dispatch<S>>)

export function dispatch<S>(): RematchDispatch<S>;
export function init<S>(config: Config<S> | undefined): Store<S>
export function model<S>(model: Model<S>): void
export function getState(): any

export namespace rematch {
  export function dispatch<S>(): RematchDispatch<S>;
  export function init<S>(config: Config<S>): Store<S>
  export function model<S>(model: Model<S>): void
  export function getState<S>(): S
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

export type Reducers<S> = {
  [key: string]: Reducer<S>,
}

export type Models<S> = {
  [key: string]: Model<S>,
}

export type ModelHook<S> = (model: Model<S>) => void

export type Validation = [boolean | undefined, string]

export type Exposed<S> = {
  dispatch: Dispatch<S> | { [key: string]: () => void },
  effects: any,
  createDispatcher: (modelName: string, reducerName: string) => any,
  validate: (validations: Validation[]) => void,
  [key: string]: any,
}

export interface Model<S> {
  name?: string,
  state: S,
  reducers?: Reducers<S>,
  effects?: {
    [key: string]: (payload: any, state: S) => void,
  },
  selectors?: {
    [key: string]: (state: S, arg?: any) => any,
  },
  subscriptions?: {
    [matcher: string]: (action: Action) => void,
  },
}

export interface Plugin<S> {
  onStoreCreated?: (store: Store<S>) => void,
  onModel?: ModelHook<S>,
  middleware?: (store: MiddlewareAPI<S>) => (next: Dispatch<S>) => (action: Action) => any,
}

export type MiddlewareDefinition<S> = (store: MiddlewareAPI<S>) => (next: Dispatch<S>) => (action: Action) => any;

export interface PluginCreator<S> {
  config?: Config<S>,
  expose?: {
    [key: string]: any,
  },
  init?: (exposed: Exposed<S>) => Plugin<S>
}

export interface RootReducers {
  [type: string]: Reducer<any>,
}

export interface ConfigRedux<S> {
  initialState?: S,
  reducers?: Reducers<S>,
  enhancers?: StoreEnhancer<S>[],
  middlewares?: Middleware[],
  rootReducers?: RootReducers,
  combineReducers?: (reducers: ReducersMapObject) => Reducer<S>,
  createStore?: StoreCreator,
  devtoolOptions?: Object,
}

export interface Config<S> {
  models?: Models<S>,
  plugins?: Array<PluginCreator<S>>,
  redux?: ConfigRedux<S>,
}
