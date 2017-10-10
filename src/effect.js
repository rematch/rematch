// @flow
import { dispatch, createDispatcher } from './dispatch'

export const effect = {} // eslint-disable-line

/**
 * effect
 */
export const createEffects = (model: $model) => {
  if (!dispatch[model.name]) {
    dispatch[model.name] = {}
  }
  Object.keys(model.effect || {}).forEach((actionName: string) => {
    if (dispatch[model.name][actionName]) {
      throw new Error(
        `action ${model.name}/${actionName} already exists. Cannot create effect`
      )
    }
    // add effect to effect
    effect[`${model.name}/${actionName}`] = model.effect[actionName]
    // add effect to action
    dispatch[model.name][actionName] = createDispatcher(model.name, actionName)
  })
}
