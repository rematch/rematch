// @flow
import { getStore } from '../redux/store'

let storeDispatch

export default {
  expose: {
    dispatch: (action: $action) => storeDispatch(action),
    createDispatcher: (modelName: string, reducerName: string) =>
      async (payload: any) => {
        const action = { type: `${modelName}/${reducerName}` }
        if (payload) {
          action.payload = payload
        }
        await storeDispatch(action)
      }
  },
  init: ({ dispatch, createDispatcher }) => ({
    onInit() {
      storeDispatch = getStore().dispatch
    },
    onModel(model: $model) {
      dispatch[model.name] = {}
      Object.keys(model.reducers || {}).forEach((reducerName: string) => {
        dispatch[model.name][reducerName] = createDispatcher(model.name, reducerName)
      })
    }
  })
}
