// @flow
export const select = {}

export const createSelectors = (model: $model) => {
  select[model.name] = model.selectors
}
