import { createSubscription } from './create'
import { createUnsubscribe } from './unsubscribe'
import { subscriptions, patternSubscriptions } from './subscriptions'

let localGetState

export default () => ({
  init: ({
    validate
  }) => {
    const triggerAllSubscriptions = (matches) => (action, matcher) => {
      // call each subscription in each model
      Object.keys(matches).forEach(modelName => {
        // create subscription with (action, unsubscribe)
        matches[modelName](action, localGetState(), () => createUnsubscribe(modelName, matcher)())
      })
    }
    return {
      onStoreCreated(getStore) {
        localGetState = getStore().getState
      },
      onModel(model: $model) {
        // a list of actions is only necessary
        // to create warnings for invalid subscription names
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
          const allMatches = subscriptions.get(type)
          // call each hook[modelName] with action
          triggerAllSubscriptions(allMatches)(action, type)
        } else {
          patternSubscriptions.forEach((handler: Object, matcher: string) => {
            if (type.match(new RegExp(matcher))) {
              const patternMatches = patternSubscriptions.get(matcher)
              triggerAllSubscriptions(patternMatches)(action, matcher)
            }
          })
        }

        return next(action)
      },
    }
  }
})
