export default (pluginExports) => ({ // eslint-disable-line
  onInit: () => [{
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

    exports.dispatch[model.name] = {} // eslint-disable-line
    Object.keys(model.reducers || {}).forEach((reducerName: string) => {
      exports.dispatch[model.name][reducerName] = createDispatcher(model.name, reducerName) // eslint-disable-line
    })
  }
})
