// @flow
let callDispatch

export const dispatch = (action: $action) => callDispatch(action)

export default function dispatchPlugin(storeDispatch: $dispatch) {
  return {
    onInit() {
      callDispatch = storeDispatch
    },
    onModel(model: $model) {
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
    }
  }
}
