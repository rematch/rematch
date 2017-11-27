import { onHandlers } from './handlers'
import omit from './omit'

const unsubscribeFrom = (modelName) => (target, formattedMatcher) => {
  const handler = target.get(formattedMatcher)
  const next = omit(modelName, handler)
  if (Object.keys(next).length) {
    // still other hooks under matcher
    target.set(formattedMatcher, next)
  } else {
    // no more hooks under matcher
    target.delete(formattedMatcher)
  }
}

// creates an unsubscribe function that can be called within a model
export const createUnsubscribe = (modelName, matcher) => () => {
  onHandlers(unsubscribeFrom(modelName))(matcher)
}
