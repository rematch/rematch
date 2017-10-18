import validate from '../utils/validate'

const hooks = new Map()

// matches actions with letter/number characters & -, _
const actionRegex = /^[A-Za-z0-9-_]+\/[A-Za-z0-9-_]+$/
const isAction = matcher => !!matcher.match(actionRegex)

const createHook = (
  matcher: string,
  onAction: (action: $action) => void
) => {
  validate([
    [typeof matcher !== 'string', 'hook matcher must be a string'],
    [typeof onAction !== 'function', 'hook onAction must be a function'],
  ])

  if (isAction(matcher)) {
    hooks.set(matcher, onAction)
  } else {
    throw new Error('Invalid hook matcher', matcher)
  }
}

export default {
  onModel: (model) => {
    Object.keys(model.hooks || {}).forEach((matcher: string) => {
      createHook(matcher, model.hooks[matcher])
    })
  },
  middleware: () => next => action => {
    const { type } = action
    // exact match
    if (hooks.has(type)) {
      hooks.get(type)(action)
    }
    return next(action)
  }
}
