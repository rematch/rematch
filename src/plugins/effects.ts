import { Store } from 'redux'
import { Action, Model, PluginCreator } from '../typings'

const effectsPlugin: PluginCreator = {
  expose: {
    effects: {},
  },
  init: ({ effects, dispatch, createDispatcher, validate }) => ({
    onModel(model: Model) {
      Object.keys(model.effects || {}).forEach((effectName: string) => {
        validate([
          [
            !!effectName.match(/\//),
            `Invalid effect name (${model.name}/${effectName})`,
          ],
          [
            typeof model.effects[effectName] !== 'function',
            `Invalid effect (${model.name}/${effectName}). Must be a function`,
          ],
        ])
        effects[`${model.name}/${effectName}`] = model.effects[effectName].bind(dispatch[model.name])
        // add effect to dispatch
        // is assuming dispatch is available already... that the dispatch plugin is in there
        dispatch[model.name][effectName] = createDispatcher(model.name, effectName)
        // tag effects so they can be differentiated from normal actions
        dispatch[model.name][effectName].isEffect = true
      })
    },
    middleware: (store: Store<any>) =>
      (next: (action: Action) => any) =>
        async (action: Action) => {
          // async/await acts as promise middleware
        return await (action.type in effects)
          ? effects[action.type](action.payload, store.getState())
          : next(action)
    },
  }),
}

export default effectsPlugin
