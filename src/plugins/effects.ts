/* tslint-disable member-ordering */
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
	onModel(model: R.Model): void {
		if (!model.effects) {
			return
		}

		const effects =
			typeof model.effects === 'function'
				? model.effects(this.dispatch)
				: model.effects

		for (const effectName of Object.keys(effects)) {
			this.validate([
				[
					!!effectName.match(/\//),
					`Invalid effect name (${model.name}/${effectName})`,
				],
				[
					typeof effects[effectName] !== 'function',
					`Invalid effect (${model.name}/${effectName}). Must be a function`,
				],
			])
			this.effects[`${model.name}/${effectName}`] = effects[effectName].bind(
				this.dispatch[model.name]
			)
			// add effect to dispatch
			// is assuming dispatch is available already... that the dispatch plugin is in there
			this.dispatch[model.name][effectName] = this.createDispatcher.apply(
				this,
				[model.name, effectName]
			)
			// tag effects so they can be differentiated from normal actions
			this.dispatch[model.name][effectName].isEffect = true
		}
	},

	// process async/await actions
	middleware(store) {
		return next => async (action: R.Action) => {
			// async/await acts as promise middleware
			if (action.type in this.effects) {
				await next(action)

				const deepClone = (targetObject: any): any =>
					JSON.parse(JSON.stringify(targetObject))

				return this.effects[action.type](
					action.payload,
					deepClone(store.getState()),
					action.meta
				)
			}
			return next(action)
		}
	},
}

export default effectsPlugin
