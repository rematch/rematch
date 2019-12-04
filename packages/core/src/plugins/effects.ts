/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/ban-ts-ignore */
import * as R from '../typings'

/**
 * Effects Plugin
 *
 * Plugin for handling async actions
 */
const effectsPlugin: R.Plugin = {
	exposed: {
		// expose effects for access from dispatch plugin
		effects: {},
	},

	// add effects to dispatch so that dispatch[modelName][effectName] calls an effect
	onModel(model: R.NamedModel, rematch: R.Rematch): void {
		if (!model.effects) {
			return
		}

		const effects =
			typeof model.effects === 'function'
				? model.effects(rematch.dispatch!)
				: model.effects

		for (const effectName of Object.keys(effects)) {
			rematch.validate([
				[
					!!effectName.match(/\//),
					`Invalid effect name (${model.name}/${effectName})`,
				],
				[
					typeof effects[effectName] !== 'function',
					`Invalid effect (${model.name}/${effectName}). Must be a function`,
				],
			])

			rematch.effects![`${model.name}/${effectName}`] = effects[
				effectName
			].bind(rematch.dispatch![model.name])

			// add effect to dispatch
			// is assuming dispatch is available already... that the dispatch plugin is in there
			// @ts-ignore
			rematch.dispatch![model.name][effectName] = rematch.createDispatcher!(
				model.name,
				effectName
			)

			// tag effects so they can be differentiated from normal actions
			// @ts-ignore
			rematch.dispatch![model.name][effectName].isEffect = true
		}
	},

	// process async/await actions
	createMiddleware(rematch: R.Rematch) {
		return store => next => (action: R.Action) => {
			// async/await acts as promise middleware
			if (action.type in rematch.effects!) {
				// run first reducer action if exists
				next(action)

				return rematch.effects![action.type](
					action.payload,
					store.getState(),
					action.meta
				)
			}

			return next(action)
		}
	},
}

export default effectsPlugin
