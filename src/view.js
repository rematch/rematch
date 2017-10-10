// @flow
import { subscribe } from './store'

let connectView

export const registerViewImplementation = (viewImplementation: any) => {
  connectView = viewImplementation(subscribe)
}

export const view = {}

export const createViews = (model: $model) => {
  const { name: modelName, select: selectors } = model
  const modelView = connectView(state => state, modelName)

  Object.keys(selectors || {}).forEach((selectorName: string) => {
    const selector = selectors[selectorName] // eslint-disable-line
    modelView[selectorName] =
      connectView(selector, modelName, selectorName)
  })

  view[modelName] = modelView
}
