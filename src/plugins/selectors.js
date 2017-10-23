// @flow
import { getStore } from '../utils/store'

export const select = {}

export default {
  onModel: (model: $model) => {
    select[model.name] = {}
    Object.keys(model.selectors || {}).forEach((selectorName: string) => {
      select[model.name][selectorName] = (...args) =>
        // autobind selector to state as first param, followed by args
        model.selectors[selectorName](getStore().getState()[model.name], ...args)
    })
  }
}
