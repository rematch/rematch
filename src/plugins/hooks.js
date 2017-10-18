import validate from '../utils/validate'

const hooks = new Map()
const patternHooks = new Map()

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

  if (!isAction(matcher)) {
    hooks.set(matcher, onAction)
  } else {
    // TODO: validate is valid action first
    // examples: *, */*, a/*, */b, a*/b, a/b*, etc.

    // set as a pattern hook, if hook does not match a specific action
    patternHooks.set(matcher, onAction)
  }
}

export default () => ({
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
    } else {
      // run matches on pattern hooks
      patternHooks.forEach((onAction: (action: $action) => void, matcher: string) => {
        if (type.match(new RegExp(matcher))) {
          onAction(action)
        }
      })
    }
    return next(action)
  }
})
