import {
	ExtractRematchStateFromModels,
	Model,
	Models,
	Plugin,
	RematchStore,
} from '@rematch/core'
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
		let func = (state: any, props: any): any => {
			func = structuredSelectorCreator(mapSelectToStructure(select))
			return func(state, props)
		}

		return (state: any, props: any) => func(state, props)
	}

	return select
}

const makeFactoryGroup = () => {
	let ready = false
	const factories = new Set()
	return {
		add(added: any) {
			if (!ready) {
				added.forEach((factory: any) => factories.add(factory))
			} else {
				added.forEach((factory: any) => factory())
			}
		},
		finish(factory: any) {
			factories.delete(factory)
		},
		startBuilding() {
			ready = true
			factories.forEach((factory: any) => factory())
		},
	}
}

const validateConfig = <
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>
>(
	config: SelectConfig<TModels, TExtraModels>
): void => {
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

const validateSelector = (
	selectorFactories: any,
	selectorName: any,
	model: any
): void => {
	if (process.env.NODE_ENV !== 'production') {
		if (typeof selectorFactories?.[selectorName] !== 'function') {
			throw new Error(
				`Selector (${model.name}/${selectorName}) must be a function`
			)
		}
	}
}

const createSelectPlugin = <
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels> = Record<string, any>
>(
	config: SelectConfig<TModels, TExtraModels> = {}
): Plugin<TModels, TExtraModels> => {
	validateConfig(config)

	const sliceState: SelectConfig<TModels, TExtraModels>['sliceState'] =
		config.sliceState || ((state, model) => state[model.name || ''])
	const selectorCreator = config.selectorCreator || createSelector

	const slice =
		(model: Model<TModels>) =>
		(stateOrNext: ExtractRematchStateFromModels<TModels, TExtraModels>) => {
			if (typeof stateOrNext === 'function') {
				return selectorCreator(
					(state: ExtractRematchStateFromModels<TModels, TExtraModels>) =>
						sliceState(state, model),
					stateOrNext
				)
			}
			return sliceState(stateOrNext, model)
		}

	const hasProps = (inner: any) =>
		function (this: any, models: any) {
			return selectorCreator(
				(props: any) => props,
				(props: any) => inner.call(this, models, props)
			)
		}

	const factoryGroup = makeFactoryGroup()

	const select = makeSelect()

	return {
		exposed: {
			select,
			// @ts-ignore
			sliceState,
			selectorCreator,
		},
		onModel(model: Model<TModels>) {
			// @ts-ignore
			select[model.name] = {}

			const selectorFactories =
				typeof model.selectors === 'function'
					? // @ts-ignore
					  model.selectors(slice(model), selectorCreator, hasProps)
					: model.selectors

			factoryGroup.add(
				Object.keys(selectorFactories || {}).map((selectorName: string) => {
					validateSelector(selectorFactories, selectorName, model)

					const factory = () => {
						factoryGroup.finish(factory)
						// @ts-ignore
						delete select[model.name][selectorName]
						// @ts-ignore
						select[model.name][selectorName] = selectorFactories[
							selectorName
							// @ts-ignore
						].call(select[model.name], select)
						// @ts-ignore
						return select[model.name][selectorName]
					}

					// Define a getter for early constructing
					// @ts-ignore
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
		onStoreCreated(store: RematchStore<TModels, TExtraModels>) {
			factoryGroup.startBuilding()
			// @ts-ignore
			store.select = select
		},
	}
}

export default createSelectPlugin
export * from './types'
