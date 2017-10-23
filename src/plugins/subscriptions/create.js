import validate from '../../utils/validate'
import { onHandlers } from './handlers'

export const createSubscription = (
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
      const regex = new RegExp(matcher)
      if (`${modelName}/${actionName}`.match(regex)) {
        throw new Error(`Subscription (${matcher}) cannot match action name (${actionName}) in its own model.`)
      }
    })

    // handlers match on { modelName: onAction }
    // to allow multiple subscriptions in different models
    let handler = { [modelName]: onAction }
    if (target.has(matcher)) {
      handler = { ...target.get(matcher), ...handler }
    }
    target.set(matcher, handler)
  }

  onHandlers(createHandler)(matcher)
}
