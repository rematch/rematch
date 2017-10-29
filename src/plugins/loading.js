// @flow
const createLoadingAction = (show) => (state, { name, action }) => {
  const next = Object.assign({}, state, {
    global: show,
    models: Object.assign({}, state.models, { [name]: show }),
    effects: Object.assign({}, state.effects, {
      [name]: Object.assign({}, state.effects[name], {
        [action]: show
      })
    })
  })
  return next
}

export default (config) => ({
  init: (exposed) => ({
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
      const modelActions = exposed.dispatch[name]
      // map over effects within models
      Object.keys(modelActions).forEach(action => {
        if (exposed.dispatch[name][action].isEffect) {
          // copy function
          const fn = exposed.dispatch[name][action]
          // create function with pre & post loading calls
          const dispatchWithHooks = async function dispatchWithHooks(props) {
            exposed.dispatch.loading.show({ name, action })
            await fn(props)
            // waits for dispatch function to finish before calling "hide"
            exposed.dispatch.loading.hide({ name, action })
          }
          // replace existing effect with new dispatch
          exposed.dispatch[name][action] = dispatchWithHooks
        }
      })
    }
  })
})
