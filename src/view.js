// @flow
import { subscribe } from './store'

let connectView

export const registerViewImplementation = viewImplementation => {
  connectView = viewImplementation(subscribe)
}

export let view = {} // eslint-disable-line

export const createViews = (model: $model) => {
  const { name: modelName, select: selectors } = model
  const modelView = connectView(state => state, modelName)

  Object.keys(selectors || {}).forEach((selectorName: string) => {
    const selector = selectors[selectorName]
    modelView[selectorName] =
      connectView(selector, modelName, selectorName)
  })

  view[modelName] = modelView
}
