import { Store, Model, Plugin } from '@rematch/core'
import { createSelector, createStructuredSelector } from 'reselect'
export { createSelector, createStructuredSelector } from 'reselect'

export const selectors = {}

/**
 * Maps models to structured selector
 * @param  mapModelsToSelectors function that gets passed `selectors` and returns an object
 * @param  structuredSelectorCreator=createStructuredSelector if you need to provide your own implementation
 *
 * @return the result of calling `structuredSelectorCreator` with the new selectors
 */
export function select(
	mapModelsToSelectors: any,
	structuredSelectorCreator = createStructuredSelector
) {
	let func = (state, props) => {
		func = structuredSelectorCreator(mapModelsToSelectors(selectors))
		return func(state, props)
	}

	return (state, props) => func(state, props)
}

export interface SelectConfig {
	sliceState?: any;
	selectorCreator?: any;
}

const validateConfig = config => {
	if (config.sliceState && typeof config.sliceState !== 'function') {
		throw new Error('select plugin config sliceState must be a function')
	}
	if (config.selectorCreator && typeof config.selectorCreator !== 'function') {
		throw new Error('select plugin config selectorCreator must be a function')
	}
}

const createSelectPlugin = (config: SelectConfig = {}): Plugin => {
	validateConfig(config)

	const sliceState = config.sliceState || ((state, model) => state[model.name])
	const selectorCreator = config.selectorCreator || createSelector

	const slice = model => stateOrNext => {
		if (typeof stateOrNext === 'function') {
			return selectorCreator(state => sliceState(state, model), stateOrNext)
		}
		return sliceState(stateOrNext, model)
	}

	const hasProps = inner =>
		function(models) {
			return selectorCreator(
				props => props,
				props => inner.call(this, models, props)
			)
		}

	let ready = false
	const factories = new Set()
	const addFactories = added => {
		if (!ready) {
			added.forEach(factory => factories.add(factory))
		} else {
			added.forEach(factory => factory())
		}
	}
	const startBuilding = () => {
		ready = true
		factories.forEach(factory => factory())
	}

	return {
		exposed: {
			select,
			selectors,
			sliceState,
			selectorCreator,
		},
		onModel(model: Model) {
			selectors[model.name] = {}

			const selectorFactories =
				typeof model.selectors === 'function'
					? model.selectors(slice(model), selectorCreator, hasProps)
					: model.selectors

			addFactories(
				Object.keys(selectorFactories || {}).map((selectorName: string) => {
					this.validate([
						[
							typeof selectorFactories[selectorName] !== 'function',
							`Selector (${model.name}/${selectorName}) must be a function`,
						],
					])

					const factory = () => {
						factories.delete(factory)
						delete selectors[model.name][selectorName]
						return (selectors[model.name][selectorName] = selectorFactories[
							selectorName
						].call(selectors[model.name], selectors))
					}

					// Define a getter for early constructing
					Object.defineProperty(selectors[model.name], selectorName, {
						configurable: true,
						get() {
							return factory()
						},
					})

					return factory
				})
			)
		},
		onStoreCreated(store: Store) {
			startBuilding()
		},
	}
}

export default createSelectPlugin
