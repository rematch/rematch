export default (config = {}) => {
  const createLoadingAction = (show) => (state, { name, action }) => {
    const next = Object.assign({}, state, {
      global: show,
      models: Object.assign({}, state.models, { [name]: show }),
    })
    if (config.effects) {
      next.effects = Object.assign({}, state.effects, {
        [name]: Object.assign({}, state.effects[name], {
          [action]: show
        })
      })
    }
    return next
  }

  const createPlugin = function loadingPlugin(dispatch) {
    // optionally change the model name. default is "loading"
    const loadingModelName = config.name || 'loading'

    const plugin = {
      model: {
        name: loadingModelName,
        state: {
          global: false,
          models: {},
        },
        reducers: {
          show: createLoadingAction(true),
          hide: createLoadingAction(false),
        }
      },
      onModel({ name }) {
        // do not run dispatch on loading model
        if (name === loadingModelName) { return }
        const modelActions = dispatch[name]
        // map over effects within models
        Object.keys(modelActions).forEach(action => {
          if (dispatch[name][action].isEffect) {
            // copy function
            const fn = dispatch[name][action]
            // create function with pre & post loading calls
            const dispatchWithHooks = async function (props) {
              dispatch.loading.show({ name, action })
              await fn(props)
              // waits for dispatch function to finish before calling "hide"
              dispatch.loading.hide({ name, action })
            }
            // replace existing effect with new dispatch
            dispatch[name][action] = dispatchWithHooks
          }
        })
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
