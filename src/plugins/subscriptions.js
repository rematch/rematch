// @flow
import validate from '../utils/validate'

const subscriptions = new Map()

// matches actions with letter/number characters & -, _
const actionRegex = /^[A-Za-z0-9-_]+\/[A-Za-z0-9-_]+$/
const isAction = matcher => !!matcher.match(actionRegex)

const createSubscription = (
  modelName: string,
  matcher: string,
  onAction: (action: $action) => void
) => {
  validate([
    [typeof matcher !== 'string', 'subscription matcher must be a string'],
    [typeof onAction !== 'function', 'subscription onAction must be a function'],
  ])

  if (isAction(matcher)) {
    // subscriptions match on { modelName: onAction }
    // to allow multiple subscriptions in different models
    let handler = { [modelName]: onAction }
    if (subscriptions.has(matcher)) {
      handler = { ...subscriptions.get(matcher), ...handler }
    }
    subscriptions.set(matcher, handler)
  } else {
    throw new Error(`Invalid subscription matcher: ${matcher}`)
  }
}

export default {
  onModel: (model: $model) => {
    Object.keys(model.subscriptions || {}).forEach((matcher: string) => {
      createSubscription(model.name, matcher, model.subscriptions[matcher])
    })
  },
  middleware: () => (next: (action: $action) => any) => (action: $action) => {
    const { type } = action

    // exact match
    if (subscriptions.has(type)) {
      const allSubscriptions = subscriptions.get(type)
      // call each hook[modelName] with action
      Object.keys(allSubscriptions).forEach(modelName => {
        allSubscriptions[modelName](action)
      })
    }

    return next(action)
  },
}
