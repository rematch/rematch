export default (config) => {
  const plugin = {
    model: {
      name: config.name || 'loading',
      state: {
        global: false,
        models: {},
      },
      reducers: {
        show: () => {},
        hide: () => {},
      }
    }
  }
  if (config.effects) {
    // collect initial models for effects and create empty objects
    plugin.model.state.effects = {}
  }
}
