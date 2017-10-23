import { subscriptions, patternSubscriptions } from './index'

// matches actions with letter/number characters & -, _
const actionRegex = /^[A-Z0-9-_]+\/[A-Z0-9-_]+$/i
// valid pattern match: letters/numbers &_-, *
// match on 'a/*', '*/b', 'a-*/b', etc.
// note: cannot match * or creates infinite loop`
const patternRegex = /^[A-Z0-9-_*]+\/[A-Z0-9-_*]+$/i

const escapeRegex = (str) => str.replace('*', '.*')

const isAction = (matcher, regex) => !!matcher.match(regex)

export const onHandlers = (call: (sub: Map) => any) => (matcher: string) => {
  if (isAction(matcher, actionRegex)) {
    call(subscriptions, matcher)
  } else if (isAction(matcher, patternRegex)) {
    const formattedMatcher = `^${escapeRegex(matcher)}$`
    call(patternSubscriptions, formattedMatcher)
  } else {
    throw new Error(`Invalid subscription matcher: ${matcher}`)
  }
}
