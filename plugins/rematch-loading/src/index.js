export default (config = {}) => {
  const createLoadingAction = (show) => (state, { namespace, action }) => {
    const next = Object.assign({}, state, {
      global: show,
      models: Object.assign({}, state.models, { [namespace]: show }),
    })
    if (config.effects) {
      next.effects = Object.assign({}, state.effects, {
        [namespace]: Object.assign({}, state.effects[namespace], {
          [action]: show
        })
      })
    }
    return next
  }

  const createPlugin = () => {
    const plugin = {
      model: {
      // optionally change the model name. default is "loading"
        name: config.name || 'loading',
        state: {
          global: false,
          models: {},
        },
        reducers: {
          show: createLoadingAction(true),
          hide: createLoadingAction(false),
        }
      }
    }
    // optionally enable config effects
    if (config.effects) {
      plugin.model.state.effects = {}
    }
    return plugin
  }

  return createPlugin
}
