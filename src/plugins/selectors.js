export default {
  onInit: () => [{
    name: 'selectors',
    val: {}
  }],
  onModel: (model, config, exports) => {
    exports.selectors[model.name] = {}
    Object.keys(model.selectors || {}).forEach((selectorName: string) => {
      exports.selectors[model.name][selectorName] = (state: any, ...args) =>
        model.selectors[selectorName](state[model.name], ...args)
    })
  }
}
