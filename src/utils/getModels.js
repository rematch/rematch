export default (config, plugins) => [
  ...Object.keys(config.models || {}).map(key => config.models[key]),
  ...plugins.reduce((a, { models }) => {
    if (models) {
      return a.concat(Object.keys(models || {}).map(key => models[key]))
    }
    return a
  }, [])
]
