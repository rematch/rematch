export default {
  exposed: {
    // access exposed actions obj using this.actions
    actions: {},
    storeDispatch() {
      console.warn('Warning: store not yet loaded')
    },
    storeGetState() {
      console.warn('Warning: store not yet loaded')
    },
    // Because we do not have access to store until the store is initialized,
    // Create a reference point for dispatch and getState that onModel can call.
    dispatch(action) {
      return this.storeDispatch(action)
    },
    getState() {
      return this.storeGetState()
    },
  },
  onStoreCreated(store) {
    this.storeDispatch = store.dispatch
    this.storeGetState = store.getState
  },
  onModel(model) {
    if (!model.actions) {
      return
    }
    if (
      typeof model.actions !== 'function' &&
      typeof model.actions !== 'object'
    ) {
      throw new Error('actions must be a function or an object')
    }

    // model.actions can be a function that takes dispatch and getState as callback params
    // or simply just an object (if you don't need to use dispatch and getState)
    const actions =
      typeof model.actions === 'function'
        ? model.actions({
            dispatch: this.dispatch,
            getState: this.getState,
          })
        : model.actions

    for (const actionName of Object.keys(actions)) {
      this.validate([
        [
          !!actionName.match(/\//),
          `Invalid action name (${model.name}/${actionName})`,
        ],
        [
          typeof actions[actionName] !== 'function' &&
            typeof actions[actionName] !== 'object',
          `Invalid action (${
            model.name
          }/${actionName}). Must be a function or an object`,
        ],
      ])

      if (typeof actions[actionName] === 'function') {
        // Bind exposed actions[modelName/actionName] to call actions[actionName]
        // actions[modelName/actionName] will be called from middleware
        this.actions[`${model.name}/${actionName}`] = actions[actionName].bind(
          this.dispatch[model.name]
        )

        // Bind exposed dispatch[modelName][actionName] to call actions[actionName]
        this.dispatch[model.name][actionName] = payload =>
          actions[actionName].call(this.dispatch[model.name], payload)
      } else if (typeof actions[actionName] === 'object') {
        // Bind exposed actions[modelName/actionName] to dispatch(actions[actionName])
        this.actions[`${model.name}/${actionName}`] = () =>
          this.dispatch(actions[actionName])

        // Bind exposed dispatch[modelName][actionName] to dispatch(actions[actionName])
        this.dispatch[model.name][actionName] = () =>
          this.dispatch(actions[actionName])
      }
    }
  },
  middleware(store) {
    return next => action => {
      if (action.type in this.actions) {
        next(action)
        return this.actions[action.type](
          action.payload,
          store.getState(),
          action.meta
        )
      } else {
        return next(action)
      }
    }
  },
}
