import { patternSubscriptions, subscriptions } from './subscriptions'

// matches actions with letter/number characters & -, _
const actionRegex = /^[A-Z0-9-_]+\/[A-Z0-9-_]+$/i
// valid pattern match: letters/numbers &_-, *
// match on 'a/*', '*/b', 'a-*/b', etc.
// note: cannot match * or creates infinite loop`
const patternRegex = /^[A-Z0-9-_*]+\/[A-Z0-9-_*]+$/i

const escapeRegex = str => str.replace(/\*/g, '.*')

const isAction = (matcher, regex) => !!matcher.match(regex)

export const onHandlers = (
	call: (sub: Map<string, any>, matcher: string) => any
) => (matcher: string) => {
	if (isAction(matcher, actionRegex)) {
		// exact match on create or unsubscribe
		call(subscriptions, matcher)
	} else if (isAction(matcher, patternRegex)) {
		// pattern match on create
		const formattedMatcher = `^${escapeRegex(matcher)}$`
		call(patternSubscriptions, formattedMatcher)
	} else if (matcher[0] === '^') {
		// pattern match, already formatted. Called by unsubscribe
		// NOTE: this should probably live elsewhere
		call(patternSubscriptions, matcher)
	} else {
		throw new Error(`Invalid subscription matcher: ${matcher}`)
	}
}
