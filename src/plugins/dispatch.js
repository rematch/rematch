export default {
  onInit: () => [{
    name: 'dispatch2',
    val: {}
  }],
  onModel: (model, config, exports, dispatch) => {
    const createDispatcher = (modelName: string, reducerName: string) => (payload: any) => {
      const action = {
        type: `${modelName}/${reducerName}`,
        ...(payload ? { payload } : {})
      }
      dispatch(action)
    }

    exports.dispatch2[model.name] = {}
    Object.keys(model.reducers || {}).forEach((reducerName: string) => {
      exports.dispatch2[model.name][reducerName] = createDispatcher(model.name, reducerName)
    })
  }
}
