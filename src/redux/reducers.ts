/* eslint no-underscore-dangle: 0 */
import { combineReducers, Reducer, ReducersMapObject } from 'redux'
import { Action, ConfigRedux, EnhancedReducers, Model, Reducers, RootReducers } from '../../typings/rematch'
import isListener from '../utils/isListener'

export default class ReducersFactory<S> {

  private combine: (reducers: ReducersMapObject) => Reducer<S> = combineReducers
  private allReducers: Reducers<S> = {}

  constructor() {
    this.createReducer = this.createReducer.bind(this)
    this.createModelReducer = this.createModelReducer.bind(this)
    this.mergeReducers = this.mergeReducers.bind(this)
    this.initReducers = this.initReducers.bind(this)
    this.createRootReducer = this.createRootReducer.bind(this)
  }

  // create reducer for given dispatch type
  // pass in (state, payload)
  public createReducer = (reducer: EnhancedReducers, initialState: S) =>
    (state: any = initialState, action: Action) => {
      // handle effects
      if (typeof reducer[action.type] === 'function') {
        return reducer[action.type](state, action.payload, action.meta)
      }
      return state
    }

  // creates a reducer out of "reducers" keys and values
  public createModelReducer = ({ name, reducers, state }: Model<S>) => {
    const modelReducers: Reducers<S> = {}
    Object.keys(reducers || {})
      .forEach((reducer) => {
        const action = isListener(reducer) ? reducer : `${name}/${reducer}`
        modelReducers[action] = reducers[reducer]
      })
    return {
      [name]: this.createReducer(modelReducers, state),
    }
  }

  // uses combineReducers to merge new reducers into existing reducers
  public mergeReducers = (nextReducers: Reducers<S> = {}) => {
    this.allReducers = { ...this.allReducers, ...nextReducers }
    if (!Object.keys(this.allReducers).length) {
      return (state: any) => state
    }
    return this.combine(this.allReducers)
  }

  public initReducers = (models: Array<Model<S>>, redux: ConfigRedux<S>): void => {
    // optionally overwrite combineReducers on init
    this.combine = redux.combineReducers || this.combine

    // combine existing reducers, redux.reducers & model.reducers
    this.mergeReducers(models.reduce((reducers, model) => ({
      ...this.createModelReducer(model),
      ...reducers,
    }), redux.reducers))
  }

  public createRootReducer = (rootReducers: RootReducers = {}): Reducer<any> => {
    const mergedReducers: Reducer<any> = this.mergeReducers()
    if (Object.keys(rootReducers).length) {
      return (state, action) => {
        const rootReducerAction = rootReducers[action.type]
        if (rootReducers[action.type]) {
          return mergedReducers(rootReducerAction(state, action), action)
        }
        return mergedReducers(state, action)
      }
    }
    return mergedReducers
  }

}
