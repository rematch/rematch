// @flow
import { createSubscription } from './create'

export const subscriptions = new Map()
export const patternSubscriptions = new Map()

const triggerAllSubscriptions = (matches) => (action) => {
  Object.keys(matches).forEach(modelName => {
    matches[modelName](action)
  })
}

export const internalInit = () => ({
  onModel(model: $model) {
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
})

export default {
  internalInit
}
