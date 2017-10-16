// @flow
import { dispatch, createDispatcher } from './dispatch'

export const effects = {}

/**
 * effects
 */
export const createEffects = (model: $model) => {
  Object.keys(model.effects || {}).forEach((effectName: string) => {
    // bind effect to dispatch[model.name] context of "this"
    // note: does not work with arrow functions
    effects[`${model.name}/${effectName}`] = model.effects[effectName].bind(
      dispatch[model.name]
    )
    // add effect to dispatch
    dispatch[model.name][effectName] = createDispatcher(model.name, effectName)
  })
}
