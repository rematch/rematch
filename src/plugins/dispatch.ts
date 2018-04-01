import { Store } from 'redux'
import { Action, Model, Plugin } from '../../typings/rematch'

const dispatchPlugin: Plugin = {
  exposed: {
    storeDispatch: () => console.warn('Warning: store not yet loaded'),
    dispatch(action: Action) {
      return this.storeDispatch(action)
    },
    createDispatcher(modelName: string, reducerName: string) {
      return async (payload?: any, meta?: any): Promise<any> => {
        const action: Action = { type: `${modelName}/${reducerName}` }
        if (typeof payload !== 'undefined') {
          action.payload = payload
        }
        if (typeof meta !== 'undefined') {
          action.meta = meta
        }
        return this.dispatch(action)
      }
    },
  },
  onStoreCreated(store: Store<any>) {
    this.storeDispatch = store.dispatch
  },
  onModel(model: Model) {
    this.dispatch[model.name] = {}
    Object.keys(model.reducers || {}).forEach((reducerName: string) => {
      this.validate([
        [
          !!reducerName.match(/\/.+\//),
          `Invalid reducer name (${model.name}/${reducerName})`,
        ],
        [
          typeof model.reducers[reducerName] !== 'function',
          `Invalid reducer (${model.name}/${reducerName}). Must be a function`,
        ],
      ])
      this.dispatch[model.name][reducerName] = this.createDispatcher.apply(this, [model.name, reducerName])
    })
  },
}

export default dispatchPlugin
