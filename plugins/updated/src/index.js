// @flow

export default (config = {}) => {
  const updatedModelName = config.name || 'updated'
  const updated = {
    name: updatedModelName,
    state: {},
    reducers: {
      onUpdate: (state, payload) => ({
        ...state,
        [payload.name]: {
          ...state[payload.name],
          [payload.action]: new Date(),
        }
      })
    }
  }
  return {
    init: ({ dispatch }) => ({
      models: {
        updated,
      },
      onModel({ name }) {
        // do not run dispatch on loading model
        if (name === updatedModelName) { return }

        const modelActions = dispatch[name]

        // add empty object for effects
        updated.state[name] = {}

        // map over effects within models
        Object.keys(modelActions).forEach(action => {
          if (dispatch[name][action].isEffect) {
            // copy function
            const fn = dispatch[name][action]
            // create function with pre & post loading calls
            const dispatchWithHooks = async function dispatchWithHooks(props) {
              await fn(props)
              // waits for dispatch function to finish before calling "hide"
              dispatch.lastUpdated.onUpdate({ name, action })
            }
            // replace existing effect with new dispatch
            dispatch[name][action] = dispatchWithHooks
          }
        })
      }
    })
  }
}
