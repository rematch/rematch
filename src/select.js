// @flow
import { subscribe } from './store'

let connectView

export const registerViewImplementation = (viewImplementation: any) => {
  connectView = viewImplementation(subscribe)
}

export const select = {}

export const createSelectors = (model: $model) => {
  select[model.name] = model.selectors
}
