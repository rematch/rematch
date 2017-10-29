// @flow
let callDispatch

export default {
  expose: {
    dispatch: (action: $action) => callDispatch(action)
  },
  init: (exposed) => ({
    onInit(getStore) {
      callDispatch = getStore().dispatch
    },
    onModel(model: $model) {
      const createDispatcher = (modelName: string, reducerName: string) => async (payload: any) => {
        const action = {
          type: `${modelName}/${reducerName}`,
          ...(payload ? { payload } : {})
        }
        await callDispatch(action)
      }

      exposed.dispatch[model.name] = {}
      Object.keys(model.reducers || {}).forEach((reducerName: string) => {
        exposed.dispatch[model.name][reducerName] = createDispatcher(model.name, reducerName)
      })
    }
  })
}
