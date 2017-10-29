// @flow
export default {
  expose: { select: {} },
  init: (exposed) => ({
    onModel(model: $model) {
      exposed.select[model.name] = {}
      Object.keys(model.selectors || {}).forEach((selectorName: string) => {
        exposed.select[model.name][selectorName] = (state: any, ...args) =>
          model.selectors[selectorName](state[model.name], ...args)
      })
    }
  })
}
