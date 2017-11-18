// @flow
export default {
  expose: {
    effects: {}
  },
  init: ({
    effects, dispatch, createDispatcher, validate
  }) => ({
    onModel(model: $model) {
      Object.keys(model.effects || {}).forEach((effectName: string) => {
        validate([
          [
            effectName.match(/\//),
            `Invalid effect name (${model.name}/${effectName})`
          ],
          [
            typeof model.effects[effectName] !== 'function',
            `Invalid effect (${model.name}/${effectName}). Must be a function`
          ]
        ])
        effects[`${model.name}/${effectName}`] = model.effects[effectName].bind(dispatch[model.name])
        // add effect to dispatch
        // is assuming dispatch is available already... that the dispatch plugin is in there
        dispatch[model.name][effectName] = createDispatcher(model.name, effectName)
        // tag effects so they can be differentiated from normal actions
        dispatch[model.name][effectName].isEffect = true
      })
    },
    middleware: (store: $store) =>
      (next: (action: $action) => any) =>
        async (action: $action) => {
          // async/await acts as promise middleware
          let result
          if (action.type in effects) {
            // NOTE: if possible, bind getState to exposeToEffects outside middleware
            result = await effects[action.type](action.payload, store.getState())
          } else {
            result = await next(action)
          }
          return result
        }
  })
}
