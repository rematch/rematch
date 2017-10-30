import pipe from './pipe'

// merges two config objects
// assumes configs are already validated
export default (c1 = {}, c2 = {}) => {
  const config = {}

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

  if (c1.rootReducerEnhancer && c2.rootReducerEnhancer) {
    config.rootReducerEnhancer = pipe(c1.rootReducerEnhancer, c2.rootReducerEnhancer)
  } else {
    config.rootReducerEnhancer = c1.rootReducerEnhancer || c2.rootReducerEnhancer
  }

  return config
}
