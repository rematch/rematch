/* eslint no-underscore-dangle: 0 */
import { applyMiddleware, createStore as _createStore, Middleware, Reducer, Store, StoreCreator } from 'redux'
import { Config, MiddlewareDefinition, Model, RootReducers } from '../../typings/rematch'
import CoreFactory from '../core'
import { composeEnhancers } from './devtools'
import ReducersFactory from './reducers'

export default class LocalStore<S> {

  public readonly pluginMiddlewares: Array<MiddlewareDefinition<S>> = []

  public store: Store<S>
  private rootReducers: RootReducers
  private reducersFactory: ReducersFactory<S>

  constructor(reducersFactory: ReducersFactory<S>) {
    this.reducersFactory = reducersFactory

    this.initStore = this.initStore.bind(this)
    this.createReducersAndUpdateStore = this.createReducersAndUpdateStore.bind(this)
  }

  public initStore({ redux }: Config<S>): Store<S> {
    const initialState: any = typeof redux.initialState === 'undefined' ? {} : redux.initialState
    const createStore: StoreCreator = redux.createStore || _createStore
    this.rootReducers = redux.rootReducers
    const rootReducer: Reducer<any> = this.reducersFactory.createRootReducer(this.rootReducers)
    const middlewareList: Array<MiddlewareDefinition<S>> =
      [...this.pluginMiddlewares, ...(redux.middlewares || [])]
    const middlewares = applyMiddleware(...middlewareList as Middleware[]) // FIXME: Not sure how to avoid this
    const enhancers = composeEnhancers(redux.devtoolOptions)(...redux.enhancers || [], middlewares)
    this.store = createStore(rootReducer, initialState, enhancers)
    return this.store
  }

  // allows for "model" to dynamically update the reducers/store
  public createReducersAndUpdateStore(model: Model<S>): void {
    this.reducersFactory.mergeReducers(this.reducersFactory.createModelReducer(model))
    this.store.replaceReducer(this.reducersFactory.createRootReducer(this.rootReducers))
  }

}
