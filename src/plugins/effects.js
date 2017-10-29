// @flow
let callDispatch

export default {
  expose: { effects: {} },
  init: (exposed) => ({
    onInit(getStore) {
      callDispatch = getStore().dispatch
    },
    onModel(model: $model) {
      const createDispatcher = (modelName: string, reducerName: string) => (payload: any) => {
        const action = {
          type: `${modelName}/${reducerName}`,
          ...(payload ? { payload } : {})
        }
        callDispatch(action)
      }

      Object.keys(model.effects || {}).forEach((effectName: string) => {
        exposed.effects[`${model.name}/${effectName}`] = model.effects[effectName].bind(exposed.dispatch[model.name])
        // add effect to dispatch
        // is assuming dispatch is available already... that the dispatch plugin is in there
        exposed.dispatch[model.name][effectName] = createDispatcher(model.name, effectName)
        // tag effects so they can be differentiated from normal actions
        exposed.dispatch[model.name][effectName].isEffect = true
      })
    },
    middleware: (store: $store) => (next: (action: $action) => any) => async (action: $action) => {
      // async/await acts as promise middleware
      let result
      if (action.type in exposed.effects) {
        result = await exposed.effects[action.type](action.payload, store.getState)
      } else {
        result = await next(action)
      }
      return result
    }
  })
}
