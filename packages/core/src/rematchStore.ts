/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { Middleware } from 'redux'
import {
	Config,
	ExposedFunction,
	Model,
	Models,
	NamedModel,
	ObjectNotAFunction,
	Plugin,
	PluginHooks,
	RematchBag,
	RematchStore,
} from './types'
import createReduxStore, {
	createModelReducer,
	createRootReducer,
} from './reduxStore'
import createDispatcher from './dispatcher'
import { validateModel } from './validate'

const createNamedModel = <S, SS, K extends string, M extends Model<S, SS, K>>(
	name: string,
	model: M
): NamedModel<S, SS, K> => {
	return {
		name,
		reducers: {},
		...model,
	}
}

/**
 * Transforms mapping from model name to model object, into an array of 'named'
 * models - models with embedded name and default value for reducers if user
 * didn't provide any.
 */
const createNamedModels = <M extends Models>(models: M): NamedModel[] => {
	return Object.keys(models).map((modelName: string) => {
		const model = createNamedModel(modelName, models[modelName])
		validateModel(model)
		return model
	})
}

/**
 * Adds properties exposed by plugins into the Rematch instance. If a exposed
 * property is a function, it passes rematch as the first argument.
 *
 * If you're implementing a plugin in TypeScript, extend Rematch namespace by
 * adding the properties that you exposed from your plugin.
 */
const addExposed = <M extends Models>(
	store: RematchStore<M>,
	plugins: Plugin<M>[]
): void => {
	for (const plugin of plugins) {
		if (plugin.exposed) {
			for (const key of Object.keys(plugin.exposed)) {
				const exposedItem = plugin.exposed[key] as
					| ExposedFunction<M>
					| ObjectNotAFunction
				const isExposedFunction = typeof exposedItem === 'function'

				// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
				// @ts-ignore
				store[key] = isExposedFunction
					? (...params: any[]): any =>
							(exposedItem as ExposedFunction<M>)(store, ...params)
					: Object.create(plugin.exposed[key])
			}
		}
	}
}

const createEffectsMiddleware = <M extends Models>(
	bag: RematchBag<M>
): Middleware => {
	return (store) => (next) => (action): any => {
		if (action.type in bag.effects) {
			// first run reducer action if exists
			const effectAction = { ...next(action) }

			// then run the effect and assign its result
			effectAction.result = bag.effects[action.type](
				action.payload,
				store.getState()
			)

			return effectAction
		}

		return next(action)
	}
}

const prepareModel = <AllModels extends Models, M extends NamedModel>(
	rematchStore: RematchStore<AllModels>,
	bag: RematchBag<AllModels>,
	model: M
): void => {
	// @ts-ignore
	rematchStore.dispatch[model.name] = createDispatcher<AllModels, M>(
		rematchStore,
		bag,
		model
	)
	bag.forEachPlugin('onModel', (onModel) => onModel(model, rematchStore))
}

const createRematchStore = <M extends Models>(
	config: Config<M>
): RematchStore<M> => {
	// setup rematch 'bag' for storing useful values and functions
	const bag: RematchBag<M> = {
		models: createNamedModels(config.models),
		reduxConfig: config.redux,
		forEachPlugin<Key extends keyof PluginHooks<M>>(
			method: Key,
			fn: (content: NonNullable<PluginHooks<M>[Key]>) => void
		): void {
			for (const plugin of config.plugins) {
				if (plugin[method]) {
					fn(plugin[method] as NonNullable<PluginHooks<M>[Key]>)
				}
			}
		},
		effects: {},
	}

	// create middleware for handling effects
	bag.reduxConfig.middlewares.push(createEffectsMiddleware(bag))

	bag.forEachPlugin('createMiddleware', (createMiddleware) => {
		bag.reduxConfig.middlewares.push(createMiddleware(bag))
	})

	const reduxStore = createReduxStore(bag)

	let rematchStore = {
		...reduxStore,
		name: config.name,
		addModel(model: NamedModel) {
			validateModel(model)
			createModelReducer(bag, model)
			prepareModel(this, bag, model)
			this.replaceReducer(createRootReducer(bag))
			reduxStore.dispatch({ type: '@@redux/REPLACE' })
		},
	} as RematchStore<M>

	rematchStore.addModel.bind(rematchStore)

	// generate dispatch[modelName][actionName] for all reducers and effects
	for (const model of bag.models) {
		prepareModel(rematchStore, bag, model)
	}

	bag.forEachPlugin('onStoreCreated', (onStoreCreated) => {
		rematchStore = onStoreCreated(rematchStore, bag) || rematchStore
	})

	addExposed(rematchStore, config.plugins)

	return rematchStore
}

export default createRematchStore
