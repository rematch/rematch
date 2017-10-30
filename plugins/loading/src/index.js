// @flow
const createLoadingAction = (show) => (state, { name, action }) => ({
  ...state,
  global: show,
  models: { ...state.models, [name]: show },
  effects: {
    ...state.effects,
    [name]: {
      ...state.effects[name],
      [action]: show
    }
  }
})

export default (config) => ({
  init: ({ dispatch }) => ({
    model: {
      name: 'loading',
      state: {
        global: false,
        models: {},
        effects: {}
      },
      reducers: {
        show: createLoadingAction(true),
        hide: createLoadingAction(false),
      }
    },
    onModel({ name }) {
      // do not run dispatch on loading model
      if (name === 'loading') { return }
      const modelActions = dispatch[name]
      // map over effects within models
      Object.keys(modelActions).forEach(action => {
        if (dispatch[name][action].isEffect) {
          // copy function
          const fn = dispatch[name][action]
          // create function with pre & post loading calls
          const dispatchWithHooks = async function dispatchWithHooks(props) {
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
  })
})
