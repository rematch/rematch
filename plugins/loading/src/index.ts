import { Action, Model, PluginCreator } from '@rematch/core'

const createLoadingAction = (show) => (state, { name, action }) => ({
  ...state,
  effects: {
    ...state.effects,
    [name]: {
      ...state.effects[name],
      [action]: show,
    },
  },
  global: show,
  models: { ...state.models, [name]: show },
})

interface LoadingConfig {
  name?: string,
}

const loadingPlugin: PluginCreator = (config: LoadingConfig = {}) => {
  const loadingModelName = config.name || 'loading'
  const loading: Model = {
    name: loadingModelName,
    reducers: {
      hide: createLoadingAction(false),
      show: createLoadingAction(true),
    },
    state: {
      effects: {},
      global: false,
      models: {},
    },
  }
  return {
    config: {
      models: {
        loading,
      },
    },
    init: ({ dispatch }) => ({
      onModel({ name }: Model) {
        // do not run dispatch on loading model
        if (name === loadingModelName) { return }
        loading.state.models[name] = false
        loading.state.effects[name] = {}
        const modelActions = dispatch[name]
        // map over effects within models
        Object.keys(modelActions).forEach((action: Action) => {
          if (dispatch[name][action].isEffect) {
            // copy function
            loading.state.effects[name][action] = false
            const fn = dispatch[name][action]
            // create function with pre & post loading calls
            const dispatchWithHooks = async (props) => {
              dispatch.loading.show({ name, action })
              await fn(props)
              // waits for dispatch function to finish before calling "hide"
              dispatch.loading.hide({ name, action })
            }
            // replace existing effect with new dispatch
            dispatch[name][action] = dispatchWithHooks
          } else {
            loading.state.models[name] = false
          }
        })
      },
    }),
  }
}

export default loadingPlugin
