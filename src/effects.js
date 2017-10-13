// @flow
import { dispatch, createDispatcher } from './dispatch'

export const effects = {}

/**
 * effects
 */
export const createEffects = (model: $model) => {
  if (!dispatch[model.name]) {
    dispatch[model.name] = {}
  }
  Object.keys(model.effects || {}).forEach((effectName: string) => {
    if (dispatch[model.name][effectName]) {
      throw new Error(
        `dispatch '${model.name}/${effectName}' already exists. Cannot create effect`
      )
    }
    // add effect to effects
    effects[`${model.name}/${effectName}`] = model.effects[effectName]
    // add effect to dispatch
    dispatch[model.name][effectName] = createDispatcher(model.name, effectName)
  })
}
