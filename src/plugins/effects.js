// TODO assumes there is a dispatch plugin
export default (pluginExports) => ({
  onInit: {
    effects: {},
  },
  onModel: (model, exports, dispatch) => {
    const createDispatcher = (modelName: string, reducerName: string) => (payload: any) => {
      const action = {
        type: `${modelName}/${reducerName}`,
        ...(payload ? { payload } : {})
      }
      dispatch(action)
    }

    Object.keys(model.effects || {}).forEach((effectName: string) => {
      exports.effects[`${model.name}/${effectName}`] = model.effects[effectName]
      // add effect to dispatch
      // is assuming dispatch is available already... that the dispatch plugin is in there
      exports.dispatch[model.name][effectName] = createDispatcher(model.name, effectName)
    })
  },
  middleware: store => next => action => {
    if (action.type in pluginExports.effects) {
      return pluginExports.effects[action.type](action.payload, store.getState)
    }
    return next(action)
  }
})
