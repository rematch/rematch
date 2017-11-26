export default (plugins: pluginCreator[], exposed) => plugins.reduce((all, { init }) => {
  if (init) {
    const plugin = init(exposed)
    exposed.validate([
      [
        plugin.onStoreCreated && typeof plugin.onStoreCreated !== 'function',
        'Plugin onStoreCreated must be a function'
      ],
      [
        plugin.onModel && typeof plugin.onModel !== 'function',
        'Plugin onModel must be a function',
      ],
      [
        plugin.middleware && typeof plugin.middleware !== 'function',
        'Plugin middleware must be a function',
      ],
    ])
    all.push(plugin)
  }
  return all
}, [])
