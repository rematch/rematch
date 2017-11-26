const captureModels = (models = {}) => Object.keys(models).map(name => ({
  name,
  ...models[name],
}))

export default (config, plugins) => [
  ...captureModels(config.models),
  ...plugins.reduce((a, { models }) => {
    if (models) {
      return a.concat(captureModels(models))
    }
    return a
  }, [])
]
