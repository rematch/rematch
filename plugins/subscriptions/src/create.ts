import { Action } from '@rematch/core'
import { onHandlers } from './handlers'

export const createSubscription = (
  modelName: string,
  matcher: string,
  onAction: (action: Action, unsubscribe: () => void) => void,
  actionList: string[],
) => {
  const createHandler = (target, formattedMatcher) => {
    // prevent infinite loops within models by validating against
    // subscription matchers in the action name
    actionList.forEach((actionName: string) => {
      const regex = new RegExp(formattedMatcher)
      if (`${modelName}/${actionName}`.match(regex)) {
        throw new Error(`Subscription (${formattedMatcher}) cannot match action name (${actionName}) in its own model.`)
      }
    })

    // handlers match on { modelName: onAction }
    // to allow multiple subscriptions in different models
    let handler = { [modelName]: onAction }
    if (target.has(formattedMatcher)) {
      handler = { ...target.get(formattedMatcher), ...handler }
    }
    target.set(formattedMatcher, handler)
  }

  onHandlers(createHandler)(matcher)
}
