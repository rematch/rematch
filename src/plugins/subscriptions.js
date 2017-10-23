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

const onHandlers = (call: (sub: Map) => any) => (matcher: string) => {
  if (isAction(matcher, actionRegex)) {
    call(subscriptions)
  } else if (isAction(matcher, patternRegex)) {
    matcher = `^${matcher.replace('*', '.\\*')}$`
    call(patternSubscriptions)
  } else {
    throw new Error(`Invalid subscription matcher: ${matcher}`)
  }
}

const createSubscription = (
  modelName: string,
  matcher: string,
  onAction: (action: $action) => void,
  actionList: string[]
) => {
  validate([
    [typeof matcher !== 'string', 'subscription matcher must be a string'],
    [typeof onAction !== 'function', 'subscription onAction must be a function'],
  ])

  const createHandler = (target) => {
    // prevent infinite loops within models by validating against
    // subscription matchers in the action name
    actionList.forEach((actionName: string) => {
      if (`${modelName}/${actionName}`.match(new RegExp(matcher))) {
        throw new Error(`Subscription (${matcher}) cannot match action name (${actionName}) in its own model.`)
      }
    })

    // handlers match on { modelName: onAction }
    // to allow multiple subscriptions in different models
    let handler = { [modelName]: onAction }
    if (target.has(matcher)) {
      handler = { ...subscriptions.get(matcher), ...handler }
    }
    target.set(matcher, handler)
  }

  onHandlers(createHandler)(matcher)
}

export default {
  onModel: (model: $model) => {
    // necessary to prevent invalid subscription names
    const actionList = [
      ...Object.keys(model.reducers || {}),
      ...Object.keys(model.effects || {})
    ]
    Object.keys(model.subscriptions || {}).forEach((matcher: string) => {
      createSubscription(model.name, matcher, model.subscriptions[matcher], actionList)
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

const omit = (prop: string, obj = {}) =>
  Object.keys(obj).reduce((next, key: string) => {
    if (key !== prop) {
      next[key] = obj[key]
    }
    return next
  }, {})

export const unsubscribe = (modelName: string, matcher: string) => {
  const unsubscribeFrom = (target) => {
    const handler = target.get(matcher)
    const next = omit(modelName, handler)
    if (Object.keys(next).length) {
      // still other hooks under matcher
      target.set(matcher, next)
    } else {
      // no more hooks under matcher
      target.delete(matcher)
    }
  }

  onHandlers(unsubscribeFrom)(matcher)
}
