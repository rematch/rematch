import * as R from '../../typings/rematch'

const dispatchPlugin: R.Plugin = {
  exposed: {
    storeDispatch: () => console.warn('Warning: store not yet loaded'),
    dispatch(action: R.Action) {
      return this.storeDispatch(action)
    },
    createDispatcher(modelName: string, reducerName: string) {
      return async (payload?: any, meta?: any): Promise<any> => {
        const action: R.Action = { type: `${modelName}/${reducerName}` }
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
  onStoreCreated(store: R.RematchStore) {
    this.storeDispatch = store.dispatch
  },
  onModel(model: R.Model) {
    this.dispatch[model.name] = {}
    if (!model.reducers) {
      return
    }
    for (const reducerName of Object.keys(model.reducers)) {
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
    }
  },
}

export default dispatchPlugin
