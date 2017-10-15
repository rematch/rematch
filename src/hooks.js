// @flow
const hooks = new Map()
const patternHooks = new Map()

// matches actions with letter/number characters & -, _
const actionRegex = /^[A-Za-z0-9-_]+\/[A-Za-z0-9-_]+$/

const isPatternMatch = matcher => !!matcher.match(actionRegex)

export const createHook = (
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
    patternHooks.set(matcher, onAction)
  } else {
    // set as a pattern hook, if hook does not match a specific action
    hooks.set(matcher, onAction)
  }
}

export const createHooks = (model: $model): void => {
  if (model.hooks) {
    if (typeof model.hooks !== 'object') {
      throw new Error('model hooks must be an object')
    }
    Object.keys(model.hooks).forEach((matcher: string) => {
      createHook(matcher, model.hooks[matcher])
    })
  }
}

export const removeHook = (matcher: string) => {
  hooks.delete(matcher)
}

export const matchHooks = (action: $action): void => {
  const { type } = action
  // exact match
  if (hooks.has(type)) {
    hooks.get(type)(action)
  } else {
    // run matches on pattern hooks
    patternHooks.forEach((value: (action: $action) => void, key: string) => {
      if (type.match(new RegExp(key))) {
        value(action)
      }
    })
  }
}
