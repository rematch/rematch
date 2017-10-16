// TODO assumes there is a dispatch plugin
export default (pluginExports) => ({
  onInit: () => [{
    name: 'effects2',
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

    Object.keys(model.effects2 || {}).forEach((effectName: string) => {
      exports.effects2[`${model.name}/${effectName}`] = model.effects2[effectName] // eslint-disable-line
      // add effect to dispatch
      // is assuming dispatch2 is available already... that the dispatch plugin is in there
      exports.dispatch2[model.name][effectName] = createDispatcher(model.name, effectName) // eslint-disable-line
    })
  },
  middleware: store => next => action => {
    let result = next(action)

    if (action.type in pluginExports.effects2) {
      result = pluginExports.effects2[action.type](action.payload, store.getState)
    }

    return result
  }
})
