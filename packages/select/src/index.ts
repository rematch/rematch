// @ts-nocheck
import { NamedModel, Plugin } from '@rematch/core'
import { createSelector, createStructuredSelector } from 'reselect'
import { SelectConfig } from './types'

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
				added.forEach((factory) => factories.add(factory))
			} else {
				added.forEach((factory) => factory())
			}
		},
		finish(factory) {
			factories.delete(factory)
		},
		startBuilding() {
			ready = true
			factories.forEach((factory) => factory())
		},
	}
}

const validateConfig = (config: SelectConfig): void => {
	if (process.env.NODE_ENV !== 'production') {
		if (config.sliceState && typeof config.sliceState !== 'function') {
			throw new Error('select plugin config sliceState must be a function')
		}

		if (
			config.selectorCreator &&
			typeof config.selectorCreator !== 'function'
		) {
			throw new Error('select plugin config selectorCreator must be a function')
		}
	}
}

const validateSelector = (selectorFactories, selectorName, model): void => {
	if (process.env.NODE_ENV !== 'production') {
		if (typeof selectorFactories![selectorName] !== 'function') {
			throw new Error(
				`Selector (${model.name}/${selectorName}) must be a function`
			)
		}
	}
}

const createSelectPlugin = (config: SelectConfig = {}): Plugin => {
	validateConfig(config)

	const sliceState = config.sliceState || ((state, model) => state[model.name])
	const selectorCreator = config.selectorCreator || createSelector

	const slice = (model) => (stateOrNext) => {
		if (typeof stateOrNext === 'function') {
			return selectorCreator((state) => sliceState(state, model), stateOrNext)
		}
		return sliceState(stateOrNext, model)
	}

	const hasProps = (inner) =>
		function (models) {
			return selectorCreator(
				(props) => props,
				(props) => inner.call(this, models, props)
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
		onModel(model: NamedModel): void {
			select[model.name] = {}

			const selectorFactories =
				typeof model.selectors === 'function'
					? model.selectors(slice(model), selectorCreator, hasProps)
					: model.selectors

			factoryGroup.add(
				Object.keys(selectorFactories || {}).map((selectorName: string) => {
					validateSelector(selectorFactories, selectorName, model)

					const factory = () => {
						factoryGroup.finish(factory)
						delete select[model.name][selectorName]
						// eslint-disable-next-line no-return-assign
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
		onStoreCreated(store): void {
			factoryGroup.startBuilding()
			store.select = select
		},
	}
}

export default createSelectPlugin
export * from './types'
