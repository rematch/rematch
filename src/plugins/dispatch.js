// @flow
let storeDispatch

export default {
  expose: {
    dispatch: (action: $action) => storeDispatch(action),
    createDispatcher: (modelName: string, reducerName: string) =>
      async (payload: any, meta: any) => {
        const action = { type: `${modelName}/${reducerName}` }
        if (payload) {
          action.payload = payload
        }
        if (meta) {
          action.meta = meta
        }
        await storeDispatch(action)
      }
  },
  init: ({ dispatch, createDispatcher, validate }) => ({
    onStoreCreated(getStore) {
      storeDispatch = getStore().dispatch
    },
    onModel(model: $model) {
      dispatch[model.name] = {}
      Object.keys(model.reducers || {}).forEach((reducerName: string) => {
        validate([
          [
            reducerName.match(/\//),
            `Invalid reducer name (${model.name}/${reducerName})`
          ],
          [
            typeof model.reducers[reducerName] !== 'function',
            `Invalid reducer (${model.name}/${reducerName}). Must be a function`
          ]
        ])
        dispatch[model.name][reducerName] = createDispatcher(model.name, reducerName)
      })
    }
  })
}
