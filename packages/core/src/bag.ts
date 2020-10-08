import { Config, Model, Models, NamedModel, RematchBag } from './types'
import { validateModel } from './validate'

/**
 * Creates and returns a 'Rematch Bag', which is a set of configuration options
 * used by the Rematch library in various functions.
 */
export default function createRematchBag<
	TModels extends Models<TModels> = Record<string, any>,
	TExtraModels extends Models<TModels> = {}
>(config: Config<TModels, TExtraModels>): RematchBag<TModels, TExtraModels> {
	return {
		models: createNamedModels(config.models),
		reduxConfig: config.redux,
		forEachPlugin(method, fn): void {
			for (const plugin of config.plugins) {
				if (plugin[method]) {
					// @ts-ignore
					// temporary ignore, see: https://github.com/microsoft/TypeScript/issues/40429
					fn(plugin[method])
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
function createNamedModels<
	TModels extends Models<TModels> = Record<string, any>
>(models: TModels): NamedModel<TModels>[] {
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
function createNamedModel<
	TModels extends Models<TModels> = Record<string, any>
>(name: string, model: Model<TModels>): NamedModel<TModels> {
	return {
		name,
		reducers: {},
		...model,
	}
}
