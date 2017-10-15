// @flow
const hooks = new Map()

export const createHook = (matcher: string, onAction: () => void) => {
  if (typeof matcher !== 'string') {
    throw new Error('hook matcher must be a string')
  }
  if (typeof onAction !== 'function') {
    throw new Error('hook onAction must be a function')
  }
  hooks.set(matcher, onAction)
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

export const removeHook = async (matcher: string) => {
  await hooks.delete(matcher)
}

export const matchHooks = (action: $action): void => {
  const { type } = action
  // exact match
  if (hooks.has(type)) {
    hooks.get(type)(action)
  }
}
