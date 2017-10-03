// @flow

/**
 * select
 */
import { _store } from './store'

export let select = {} // eslint-disable-line

export const createSelectors = (model: $model) => {
  select[model.name] = {}
  Object.keys(model.select || {}).forEach((selector: string) => {
    select[model.name][selector] = (...args) => {
      const modelState = _store.getState()[model.name]
      return model.select[selector](modelState, ...args)
    }
  })
}
