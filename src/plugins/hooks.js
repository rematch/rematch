export default (pluginExports) => ({
  onInit: () => [{
    name: 'hooks',
    val: new Map()
  }, {
    name: 'patternHooks',
    val: new Map()
  }],
  onModel: (model, exports) => {
    // matches actions with letter/number characters & -, _
    const actionRegex = /^[A-Za-z0-9-_]+\/[A-Za-z0-9-_]+$/
    const isPatternMatch = matcher => !!matcher.match(actionRegex)
    const createHook = (
      matcher: string,
      onAction: (action: $action) => void
    ) => {
      if (typeof matcher !== 'string') {
        throw new Error('hook matcher must be a string')
      }
      if (typeof onAction !== 'function') {
        throw new Error('hook onAction must be a function')
      }
      if (isPatternMatch(matcher)) {
        exports.patternHooks.set(matcher, onAction)
      } else {
        // set as a pattern hook, if hook does not match a specific action
        exports.hooks.set(matcher, onAction)
      }
    }

    Object.keys(model.hooks || {}).forEach((matcher: string) => {
      createHook(matcher, model.hooks[matcher])
    })
  },
  middleware: store => next => action => { // eslint-disable-line
    const matchHooks = (action: $action): void => { // eslint-disable-line
      const { type } = action
      // exact match
      if (pluginExports.hooks.has(type)) {
        pluginExports.hooks.get(type)(action)
      } else {
        // run matches on pattern hooks
        pluginExports.patternHooks.forEach((value: (action: $action) => void, key: string) => {
          if (type.match(new RegExp(key))) {
            value(action)
          }
        })
      }
    }

    let result = next(action) // eslint-disable-line

    matchHooks(action)

    return result
  }
})
