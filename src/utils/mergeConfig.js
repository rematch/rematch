import pipe from './pipe'

// merges two config objects
// assumes configs are already validated
export const mergeConfig = (c1 = {}, c2 = {}) => {
  const config = {}

  if (c1.models) {
    config.models = Object.keys(c1.models).reduce((a, b) => {
      const model = c1.models[b]
      return {
        [model.name]: model,
        ...a,
      }
    }, {})
  }

  // initialState
  config.initialState = c1.initialState || {}
  if (c2.initialState) {
    config.initialState = {
      ...c1.initialState,
      ...c2.initialState,
    }
  }

  config.plugins = c1.plugins || []
  if (c2.plugins) {
    c2.plugins.forEach(plugin => {
      if (!config.plugins.includes(plugin)) {
        config.plugins.push(plugin)
      }
    })
  }

  config.extraReducers = c1.extraReducers || {}
  if (c2.extraReducers) {
    config.extraReducers = {
      ...c1.extraReducers,
      ...c2.extraReducers
    }
  }

  if (c1.customCombineReducers && c2.customCombineReducers) {
    config.customCombineReducers = pipe(c1.customCombineReducers, c2.customCombineReducers)
  } else {
    config.customCombineReducers = c1.customCombineReducers || c2.customCombineReducers
  }

  return config
}

export default (config) => (config.plugins || []).reduce((a, b) => {
  if (b.config) {
    return mergeConfig(a, b.config)
  }
  return a
}, config)
