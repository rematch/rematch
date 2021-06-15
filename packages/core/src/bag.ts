import { Config, Model, Models, NamedModel, RematchBag } from './types'
import { validateModel } from './validate'

/**
 * Creates and returns a 'Rematch Bag', which is a set of configuration options
 * used by the Rematch library in various functions.
 */
export default function createRematchBag<
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>
>(config: Config<TModels, TExtraModels>): RematchBag<TModels, TExtraModels> {
	return {
		models: createNamedModels(config.models),
		reduxConfig: config.redux,
		forEachPlugin(method, fn): void {
			config.plugins.forEach((plugin) => {
				if (plugin[method]) {
					fn(plugin[method]!)
				}
			})
		},
		effects: {},
	}
}

/**
 * Transforms mapping from a model name to a model object, into an array of
 * 'named' models - models with embedded name and default value for reducers
 * if user didn't provide any.
 */
function createNamedModels<TModels extends Models<TModels>>(
	models: TModels | Partial<TModels>
): NamedModel<TModels>[] {
	return Object.keys(models).map((modelName: string) => {
		const model = createNamedModel(modelName, (models as TModels)[modelName])
		validateModel(model)
		return model
	})
}

/**
 * Transforms a model into 'named' model - model which contains 'name' and
 * 'reducers' properties if user didn't provide any.
 */
function createNamedModel<TModels extends Models<TModels>>(
	name: string,
	model: Model<TModels>
): NamedModel<TModels> {
	return {
		name,
		reducers: {},
		...model,
	}
}
