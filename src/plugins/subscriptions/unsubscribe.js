import { omit } from './helpers'
import { onHandlers } from './handlers'

export const unsubscribe = (modelName: string, matcher: string) => {
  const unsubscribeFrom = (target, formattedMatcher) => {
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

  onHandlers(unsubscribeFrom)(matcher)
}
