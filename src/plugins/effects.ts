/* tslint-disable member-ordering */
import { Dispatch, MiddlewareAPI, Store } from 'redux'
import { Action, Exposed, Model, PluginCreator } from '../../typings/rematch'
import PluginFactory from './PluginFactory'

export default {
  exposed: {
    effects: {},
  },
  onModel(model: Model): void {
    Object.keys(model.effects || {}).forEach((effectName: string) => {
      this.validate([
        [
          !!effectName.match(/\//),
          `Invalid effect name (${model.name}/${effectName})`,
        ],
        [
          typeof model.effects[effectName] !== 'function',
          `Invalid effect (${model.name}/${effectName}). Must be a function`,
        ],
      ])
      this.effects[`${model.name}/${effectName}`] = model.effects[effectName].bind(this.dispatch[model.name])
      // add effect to dispatch
      // is assuming dispatch is available already... that the dispatch plugin is in there
      this.dispatch[model.name][effectName] = this.createDispatcher(model.name, effectName)
      // tag effects so they can be differentiated from normal actions
      this.dispatch[model.name][effectName].isEffect = true
    })
  },
  middleware: (store) => (next) => async (action: Action) => {
    // async/await acts as promise middleware
    if (action.type in this.effects) {
      await next(action)
      return this.effects[action.type](action.payload, store.getState(), action.meta)
    } else {
      return next(action)
    }
  },
}
