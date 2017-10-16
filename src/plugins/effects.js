// TODO assumes there is a dispatch plugin
export default (pluginExports) => ({
  onInit: () => [{
    name: 'effects',
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

    Object.keys(model.effects || {}).forEach((effectName: string) => {
      exports.effects[`${model.name}/${effectName}`] = model.effects[effectName] // eslint-disable-line
      // add effect to dispatch
      // is assuming dispatch is available already... that the dispatch plugin is in there
      exports.dispatch[model.name][effectName] = createDispatcher(model.name, effectName) // eslint-disable-line
    })
  },
  middleware: store => next => action => {
    let result = next(action)

    if (action.type in pluginExports.effects) {
      result = pluginExports.effects[action.type](action.payload, store.getState)
    }

    return result
  }
})
