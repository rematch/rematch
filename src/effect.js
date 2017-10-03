// @flow
import { action, createAction } from './action'

export const effect = {} // eslint-disable-line

/**
 * effect
 */
export const createEffects = (model: $model) => {
  if (!action[model.name]) {
    action[model.name] = {}
  }
  Object.keys(model.effect || {}).forEach((actionName: string) => {
    if (action[model.name][actionName]) {
      throw new Error(
        `action ${model.name}/${actionName} already exists. Cannot create effect`
      )
    }
    // add effect to effect
    effect[`${model.name}/${actionName}`] = model.effect[actionName]
    // add effect to action
    action[model.name][actionName] = createAction(model.name, actionName)
  })
}
