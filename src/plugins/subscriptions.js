// @flow
import validate from '../utils/validate'

const subscriptions = new Map()
const patternSubscriptions = new Map()

// matches actions with letter/number characters & -, _
const actionRegex = /^[A-Z0-9-_]+\/[A-Z0-9-_]+$/i
// valid pattern match: letters/numbers &_-, *
// match on 'a/*', '*/b', 'a-*/b', etc.
// note: cannot match * or creates infinite loop`
const patternRegex = /^[A-Z0-9-_*]+\/[A-Z0-9-_*]+$/i
const isAction = (matcher, regex) => !!matcher.match(regex)

const triggerAllSubscriptions = (matches) => (action) => {
  Object.keys(matches).forEach(modelName => {
    matches[modelName](action)
  })
}

const createSubscription = (
  modelName: string,
  matcher: string,
  onAction: (action: $action) => void
) => {
  validate([
    [typeof matcher !== 'string', 'subscription matcher must be a string'],
    [typeof onAction !== 'function', 'subscription onAction must be a function'],
  ])

  const createHandler = (target) => {
    // handlers match on { modelName: onAction }
    // to allow multiple subscriptions in different models
    let handler = { [modelName]: onAction }
    if (target.has(matcher)) {
      handler = { ...subscriptions.get(matcher), ...handler }
    }
    target.set(matcher, handler)
  }

  if (isAction(matcher, actionRegex)) {
    createHandler(subscriptions)
  } else if (isAction(matcher, patternRegex)) {
    matcher = `^${matcher.replace('*', '.*')}$`
    createHandler(patternSubscriptions)
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
      triggerAllSubscriptions(allSubscriptions)(action)
    } else {
      patternSubscriptions.forEach((handler: Object, matcher: string) => {
        if (type.match(new RegExp(matcher))) {
          const subscriptionMatches = patternSubscriptions.get(matcher)
          triggerAllSubscriptions(subscriptionMatches)(action)
        }
      })
    }

    return next(action)
  },
}
