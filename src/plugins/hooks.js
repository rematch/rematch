import validate from '../utils/validate'

const hooks = new Map()

// matches actions with letter/number characters & -, _
const actionRegex = /^[A-Za-z0-9-_]+\/[A-Za-z0-9-_]+$/
const isAction = matcher => !!matcher.match(actionRegex)

const createHook = (
  modelName: string,
  matcher: string,
  onAction: (action: $action) => void
) => {
  validate([
    [typeof matcher !== 'string', 'hook matcher must be a string'],
    [typeof onAction !== 'function', 'hook onAction must be a function'],
  ])

  if (isAction(matcher)) {
    // hooks match on modelName and action
    // to allow multiple hooks in different models
    let handler = { [modelName]: onAction }
    if (hooks.has(matcher)) {
      handler = { ...hooks.get(matcher), ...handler }
    }
    hooks.set(matcher, handler)
  } else {
    throw new Error('Invalid hook matcher', matcher)
  }
}

export default {
  onModel: (model) => {
    Object.keys(model.hooks || {}).forEach((matcher: string) => {
      createHook(model.name, matcher, model.hooks[matcher])
    })
  },
  middleware: () => next => action => {
    const { type } = action

    // exact match
    if (hooks.has(type)) {
      const allHooks = hooks.get(type)
      // call each hook[modelName] with action
      Object.keys(allHooks).forEach((modelName) => {
        allHooks[modelName](action)
      })
    }

    return next(action)
  }
}
