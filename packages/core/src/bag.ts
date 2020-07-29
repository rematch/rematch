import {
	Config,
	Model,
	Models,
	NamedModel,
	PluginHooks,
	RematchBag,
} from './types'
import { validateModel } from './validate'

/**
 * Creates and returns a 'Rematch Bag', which is a set of configuration options
 * used by the Rematch library in various functions.
 */
export default function createRematchBag<TModels extends Models>(
	config: Config<TModels>
): RematchBag {
	return {
		models: createNamedModels(config.models),
		reduxConfig: config.redux,
		forEachPlugin<Hook extends keyof PluginHooks>(
			method: Hook,
			fn: (content: NonNullable<PluginHooks[Hook]>) => void
		): void {
			for (const plugin of config.plugins) {
				if (plugin[method]) {
					fn(plugin[method] as NonNullable<PluginHooks[Hook]>)
				}
			}
		},
		effects: {},
	}
}

/**
 * Transforms mapping from a model name to a model object, into an array of
 * 'named' models - models with embedded name and default value for reducers
 * if user didn't provide any.
 */
function createNamedModels<M extends Models>(models: M): NamedModel[] {
	return Object.keys(models).map((modelName: string) => {
		const model = createNamedModel(modelName, models[modelName])
		validateModel(model)
		return model
	})
}

/**
 * Transforms a model into 'named' model - model which contains 'name' and
 * 'reducers' properties if user didn't provide any.
 */
function createNamedModel<S, SS>(
	name: string,
	model: Model<S, SS>
): NamedModel<S, SS> {
	return {
		name,
		reducers: {},
		...model,
	}
}
