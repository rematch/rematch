import { Dispatch, MiddlewareAPI, Store } from 'redux'
import { Action, Exposed, Model, Plugin, PluginCreator } from '../../typings/rematch'

export default class EffectsPluginsFactory<S> {

  public effectsPlugin: PluginCreator<S> = {
    expose: {
      effects: {},
    },
    init: ({ effects, dispatch, createDispatcher, validate }: Exposed<S>): Plugin<S> => ({
      onModel(model: Model<S>): void {
        Object.keys(model.effects || {}).forEach((effectName: string) => {
          if (process.env.NODE_ENV !== 'production') {
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
          }
          effects[`${model.name}/${effectName}`] = model.effects[effectName].bind(dispatch[model.name])
          // add effect to dispatch
          // is assuming dispatch is available already... that the dispatch plugin is in there
          dispatch[model.name][effectName] = createDispatcher(model.name, effectName)
          // tag effects so they can be differentiated from normal actions
          dispatch[model.name][effectName].isEffect = true
        })
      },
      middleware: (store: MiddlewareAPI<S>) => (next: Dispatch<S>) => async (action: Action) => {
        // async/await acts as promise middleware
        const result = (action.type in effects)
          ? await effects[action.type](action.payload, store.getState(), action.meta)
          : await next(action)
        return result
      },
    }),
  }

}
