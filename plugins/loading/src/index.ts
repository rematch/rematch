import { Action, Model, PluginCreator } from '@rematch/core'

const createLoadingAction = (show) => (state, { name, action }: any) => ({
  ...state,
  global: state.global + (show ? 1 : -1),
  models: {
    ...state.models,
    [name]: state.models[name] + (show ? 1 : -1),
  },
  effects: {
    ...state.effects,
    [name]: {
      ...state.effects[name],
      [action]: state.effects[name][action] + (show ? 1 : -1),
    },
  },
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
      global: 0,
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
        // do not run dispatch on "loading" model
        if (name === loadingModelName) { return }

        loading.state.models[name] = 0
        loading.state.effects[name] = {}
        const modelActions = dispatch[name]

        // map over effects within models
        Object.keys(modelActions).forEach((action: string) => {
          if (dispatch[name][action].isEffect !== true) {
            return
          }

          loading.state.effects[name][action] = 0

          const actionType = `${name}/${action}`

          // ignore items not in whitelist
          if (config.whitelist && !config.whitelist.includes(actionType)) {
            return
          }

          // ignore items in blacklist
          if (config.blacklist && config.blacklist.includes(actionType)) {
            return
          }

          // copy orig effect pointer
          const origEffect = dispatch[name][action]

          // create function with pre & post loading calls
          const effectWrapper = async (...props) => {
            try {
              dispatch.loading.show({ name, action })
              await origEffect(...props)
              // waits for dispatch function to finish before calling "hide"
            } finally {
              dispatch.loading.hide({ name, action })
            }
          }

          // replace existing effect with new wrapper
          dispatch[name][action] = effectWrapper
        })
      },
    }),
  }
}

export default loadingPlugin
