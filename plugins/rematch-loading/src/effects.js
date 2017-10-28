const addLoadingToEffects = (name, dispatch) => {
  Object.keys(dispatch).forEach(namespace => {
    if (namespace === name) { return }
    const modelActions = dispatch[namespace]
    // map over effects within models
    Object.keys(modelActions).forEach(action => {
      if (dispatch[namespace][action].isEffect) {
        // copy function
        const fn = dispatch[namespace][action]
        // replace function with pre & post loading calls
        dispatch[namespace][action] = async function (props) {
          dispatch.loading.show({ namespace, action })
          await fn(props)
          dispatch.loading.hide({ namespace, action })
        }
      }
    })
  })
}

export default addLoadingToEffects
