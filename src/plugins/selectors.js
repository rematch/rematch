export default () => ({
  onInit: {
    select: {}
  },
  onModel: (model, exports) => {
    exports.select[model.name] = {}
    Object.keys(model.selectors || {}).forEach((selectorName: string) => {
      exports.select[model.name][selectorName] = (state: any, ...args) =>
        model.selectors[selectorName](state[model.name], ...args)
    })
  }
})
