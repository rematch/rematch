// @flow
export const dispatch = {}

export default () => ({
  onModel: (model: $model, storeDispatch: (action: $action) => any) => {
    const createDispatcher = (modelName: string, reducerName: string) => (payload: any) => {
      const action = {
        type: `${modelName}/${reducerName}`,
        ...(payload ? { payload } : {})
      }
      storeDispatch(action)
    }

    dispatch[model.name] = {}
    Object.keys(model.reducers || {}).forEach((reducerName: string) => {
      dispatch[model.name][reducerName] = createDispatcher(model.name, reducerName)
    })
  }
})
