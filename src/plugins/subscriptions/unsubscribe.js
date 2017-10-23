import { omit } from './helpers'
import { onHandlers } from './handlers'

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
