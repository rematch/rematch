import { Model, Plugin, RematchStore } from '@rematch/core'
import { createSelector, createStructuredSelector } from 'reselect'
import { SelectConfig } from './typings'

export { createSelector, createStructuredSelector } from 'reselect'

const makeSelect = () => {
	/**
	 * Maps models to structured selector
	 * @param  mapSelectToStructure function that gets passed `selectors` and returns an object
	 * @param  structuredSelectorCreator=createStructuredSelector if you need to provide your own implementation
	 *
	 * @return the result of calling `structuredSelectorCreator` with the new selectors
	 */
	function select(
		mapSelectToStructure: any,
		structuredSelectorCreator = createStructuredSelector
	) {
		let func = (state, props) => {
			func = structuredSelectorCreator(mapSelectToStructure(select))
			return func(state, props)
		}

		return (state, props) => func(state, props)
	}

	return select
}

const makeFactoryGroup = () => {
	let ready = false
	const factories = new Set()
	return {
		add(added) {
			if (!ready) {
				added.forEach(factory => factories.add(factory))
			} else {
				added.forEach(factory => factory())
			}
		},
		finish(factory) {
			factories.delete(factory)
		},
		startBuilding() {
			ready = true
			factories.forEach(factory => factory())
		},
	}
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

	const factoryGroup = makeFactoryGroup()

	const select = makeSelect()

	return {
		exposed: {
			select,
			sliceState,
			selectorCreator,
		},
		onModel(model: Model) {
			select[model.name] = {}

			const selectorFactories =
				typeof model.selectors === 'function'
					? model.selectors(slice(model), selectorCreator, hasProps)
					: model.selectors

			factoryGroup.add(
				Object.keys(selectorFactories || {}).map((selectorName: string) => {
					this.validate([
						[
							typeof selectorFactories[selectorName] !== 'function',
							`Selector (${model.name}/${selectorName}) must be a function`,
						],
					])

					const factory = () => {
						factoryGroup.finish(factory)
						delete select[model.name][selectorName]
						return (select[model.name][selectorName] = selectorFactories[
							selectorName
						].call(select[model.name], select))
					}

					// Define a getter for early constructing
					Object.defineProperty(select[model.name], selectorName, {
						configurable: true,
						get() {
							return factory()
						},
					})

					return factory
				})
			)
		},
		onStoreCreated(store: RematchStore) {
			factoryGroup.startBuilding()

			return {
				select,
			}
		},
	}
}

export default createSelectPlugin
