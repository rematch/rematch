export default () => ({
  onInit: [{
    name: 'dispatch',
    val: {}
  }],
  onModel: (model, exports, dispatch) => {
    const createDispatcher = (modelName: string, reducerName: string) => (payload: any) => {
      const action = {
        type: `${modelName}/${reducerName}`,
        ...(payload ? { payload } : {})
      }
      dispatch(action)
    }

    exports.dispatch[model.name] = {}
    Object.keys(model.reducers || {}).forEach((reducerName: string) => {
      exports.dispatch[model.name][reducerName] = createDispatcher(model.name, reducerName)
    })
  }
})
