export default (pluginExports) => ({ // eslint-disable-line
  onInit: () => [{
    name: 'dispatch2',
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

    exports.dispatch2[model.name] = {} // eslint-disable-line
    Object.keys(model.reducers || {}).forEach((reducerName: string) => {
      exports.dispatch2[model.name][reducerName] = createDispatcher(model.name, reducerName) // eslint-disable-line
    })
  }
})
