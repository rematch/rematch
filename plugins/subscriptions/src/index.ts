import { Action, Model, Plugin } from '@rematch/core'
import { createSubscription } from './create'
import { patternSubscriptions, subscriptions } from './subscriptions'
import { createUnsubscribe } from './unsubscribe'

let localGetState

const triggerAllSubscriptions = matches => (action, matcher) => {
	// call each subscription in each model
	Object.keys(matches).forEach((modelName: string) => {
		// create subscription with (action, unsubscribe)
		matches[modelName](action, localGetState(), () =>
			createUnsubscribe(modelName, matcher)()
		)
	})
}

const subscriptionsPlugin = (): Plugin => ({
	onStoreCreated(store) {
		localGetState = store.getState
	},
	onModel(model: Model) {
		// a list of actions is only necessary
		// to create warnings for invalid subscription names
		const actionList = [
			...Object.keys(model.reducers || {}),
			...Object.keys(model.effects || {}),
		]
		Object.keys(model.subscriptions || {}).forEach((matcher: string) => {
			this.validate([
				[
					!!matcher.match(/\/(.+)?\//),
					`Invalid subscription matcher (${matcher})`,
				],
				[
					typeof model.subscriptions[matcher] !== 'function',
					`Subscription matcher in ${model.name} (${matcher}) must be a function`,
				],
			])
			const onAction = model.subscriptions[matcher]
			createSubscription(model.name, matcher, onAction, actionList)
		})
	},
	middleware() {
		return (next: (action: Action) => any) => (action: Action) => {
			const { type } = action

			// exact match
			if (subscriptions.has(type)) {
				const allMatches = subscriptions.get(type)
				// call each hook[modelName] with action
				triggerAllSubscriptions(allMatches)(action, type)
			} else {
				patternSubscriptions.forEach((handler: object, matcher: string) => {
					if (type.match(new RegExp(matcher))) {
						const patternMatches = patternSubscriptions.get(matcher)
						triggerAllSubscriptions(patternMatches)(action, matcher)
					}
				})
			}

			return next(action)
		}
	},
})

export default subscriptionsPlugin
