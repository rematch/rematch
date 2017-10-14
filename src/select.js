// @flow
export const select = {}

export const createSelectors = (model: $model) => {
  select[model.name] = {}

  Object.keys(model.selectors || {}).forEach((selectorName: string) => {
    select[model.name][selectorName] = (state: any, ...args) =>
      model.selectors[selectorName](state[model.name], ...args)
  })
}

