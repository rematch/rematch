/* tslint-disable member-ordering */
import * as R from '../../typings/rematch'

/**
 * Effects Plugin
 *
 * Plugin for handling async actions
 */
const effectsPlugin: R.Plugin = {

  exposed: {
    // expose effects for access from dispatch plugin
    effects: {},
  },

  // add effects to dispatch so that dispatch[modelName][effectName] calls an effect
  onModel(model: R.Model): void {
    if (!model.effects) {
      return
    }
    for (const effectName of Object.keys(model.effects)) {
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
      this.dispatch[model.name][effectName] = this.createDispatcher.apply(this, [model.name, effectName])
      // tag effects so they can be differentiated from normal actions
      this.dispatch[model.name][effectName].isEffect = true
    }
  },

  // process async/await actions
  middleware(store) {
    return (next) => async (action: R.Action) => {
      // async/await acts as promise middleware
      // FIXME: why is .default.exposed.effects necessary?
      if (action.type in this.effects) {
        await next(action)
        // FIXME: why is .default.exposed.effects necessary?
        return this.effects[action.type](action.payload, store.getState(), action.meta)
      } else {
        return next(action)
      }
    }
  },
}

export default effectsPlugin
