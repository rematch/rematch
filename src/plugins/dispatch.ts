import { Dispatch, Store } from 'redux'
import { Action, Exposed, Model, Plugin, PluginCreator } from '../../typings/rematch'

let storeDispatch: Dispatch<any>

const dispatchPlugin: PluginCreator = {
  expose: {
    createDispatcher: (modelName: string, reducerName: string) =>
      async (payload?: any, meta?: any): Promise<any> => {
        const action: Action = { type: `${modelName}/${reducerName}` }
        if (typeof payload !== 'undefined') {
          action.payload = payload
        }
        if (typeof meta !== 'undefined') {
          action.meta = meta
        }
        await storeDispatch(action)
      },
    dispatch: (action: Action) => storeDispatch(action),
  },
  init: ({ dispatch, createDispatcher, validate }: Exposed): Plugin => ({
    onStoreCreated(store: Store<any>) {
      storeDispatch = store.dispatch
    },
    onModel(model: Model) {
      dispatch[model.name] = {}
      Object.keys(model.reducers || {}).forEach((reducerName: string) => {
        if (process.env.NODE_ENV !== 'production') {
          validate([
            [
              !!reducerName.match(/\//),
              `Invalid reducer name (${model.name}/${reducerName})`,
            ],
            [
              typeof model.reducers[reducerName] !== 'function',
              `Invalid reducer (${model.name}/${reducerName}). Must be a function`,
            ],
          ])
        }
        dispatch[model.name][reducerName] = createDispatcher(model.name, reducerName)
      })
    },
  }),
}

export default dispatchPlugin
