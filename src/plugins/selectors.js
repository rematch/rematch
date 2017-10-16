export default (pluginExports) => ({ // eslint-disable-line
  onInit: () => [{
    name: 'select',
    val: {}
  }],
  onModel: (model, exports) => {
    exports.select[model.name] = {} // eslint-disable-line
    Object.keys(model.selectors || {}).forEach((selectorName: string) => {
      exports.select[model.name][selectorName] = (state: any, ...args) => // eslint-disable-line
        model.selectors[selectorName](state[model.name], ...args)
    })
  }
})
