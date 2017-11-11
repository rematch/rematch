// @flow
import { createSubscription } from './create'
import { createUnsubscribe } from './unsubscribe'

export const subscriptions = new Map()
export const patternSubscriptions = new Map()

const triggerAllSubscriptions = (matches) => (action) => {
  Object.keys(matches).forEach(modelName => {
    matches[modelName](action)
  })
}

export default {
  init: ({ validate }) => ({
    onModel(model: $model) {
      // necessary to prevent invalid subscription names
      const actionList = [
        ...Object.keys(model.reducers || {}),
        ...Object.keys(model.effects || {})
      ]
      Object.keys(model.subscriptions || {}).forEach((matcher: string) => {
        validate([
          [

            matcher.match(/\/(.+)?\//),
            `Invalid subscription matcher (${matcher})`
          ],
          [
            typeof model.subscriptions[matcher] !== 'function',
            `Subscription matcher in ${model.name} (${matcher}) must be a function`
          ]
        ])
        const onAction = model.subscriptions[matcher]
        createSubscription(model.name, matcher, onAction, actionList)
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
            const unsubscribe = createUnsubscribe(handler, matcher)
            triggerAllSubscriptions(subscriptionMatches)(action, unsubscribe)
          }
        })
      }

      return next(action)
    },
  })
}
