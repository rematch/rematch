import { onHandlers } from './handlers'
import omit from '../../utils/omit'

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

export const createUnsubscribe = (handler, matcher) => () => {
  const modelName = Object.keys(handler)[0]
  onHandlers(unsubscribeFrom(modelName))(matcher)
}
