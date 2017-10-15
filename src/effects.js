// @flow
import { dispatch, createDispatcher } from './dispatch'

export const effects = {}

/**
 * effects
 */
export const createEffects = (model: $model) => {
  Object.keys(model.effects || {}).forEach((effectName: string) => {
    // add effect to effects
    effects[`${model.name}/${effectName}`] = model.effects[effectName]
    // add effect to dispatch
    dispatch[model.name][effectName] = createDispatcher(model.name, effectName)
  })
}
