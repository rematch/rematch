// @flow
let callDispatch

export const dispatch = (action: $action) => callDispatch(action)

export default {
  onInit: (storeDispatch: $dispatch) => {
    callDispatch = storeDispatch
  },
  onModel: (model: $model, storeDispatch: $dispatch) => {
    const createDispatcher = (modelName: string, reducerName: string) => async (payload: any) => {
      const action = {
        type: `${modelName}/${reducerName}`,
        ...(payload ? { payload } : {})
      }
      await storeDispatch(action)
    }

    dispatch[model.name] = {}
    Object.keys(model.reducers || {}).forEach((reducerName: string) => {
      dispatch[model.name][reducerName] = createDispatcher(model.name, reducerName)
    })
  },
}
