import { Action, Model, PluginCreator } from '@rematch/core'

const createLoadingAction = (show) => (state, { name, action }: any) => ({
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
  whitelist?: string[],
  blacklist?: string[],
}

const loadingPlugin = (config: LoadingConfig = {}): any => {
  // validate config
  if (config.name && typeof config.name !== 'string') {
    throw new Error('loading plugin config name must be a string')
  }
  if (config.whitelist && !Array.isArray(config.whitelist)) {
    throw new Error('loading plugin config whitelist must be an array of strings')
  }
  if (config.blacklist && !Array.isArray(config.blacklist)) {
    throw new Error('loading plugin config blacklist must be an array of strings')
  }
  if (config.whitelist && config.blacklist) {
    throw new Error('loading plugin config cannot have both a whitelist & a blacklist')
  }

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
        Object.keys(modelActions).forEach((action: string) => {
          if (dispatch[name][action].isEffect) {

            // ignore items not in whitelist
            if (config.whitelist && !config.whitelist.includes(`${name}/${action}`)) {
              return
            }

            // ignore items in blacklist
            if (config.blacklist && config.blacklist.includes(`${name}/${action}`)) {
              return
            }

            // copy function
            loading.state.effects[name][action] = false
            const fn = dispatch[name][action]
            // create function with pre & post loading calls
            const dispatchWithHooks = async (props) => {
              try {
                dispatch.loading.show({ name, action })
                await fn(props)
                // waits for dispatch function to finish before calling "hide"
                dispatch.loading.hide({ name, action })
              } catch {
                dispatch.loading.hide({ name, action })
              }
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
