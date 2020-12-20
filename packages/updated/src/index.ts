import {
	ExtractRematchDispatchersFromEffects,
	Models,
	Plugin,
	Model,
} from '@rematch/core'

export interface UpdatedConfig<T = Date> {
	name?: string
	blacklist?: string[]
	dateCreator?(): T
}

type UpdatedState<TModels extends Models<TModels>, T = Date> = {
	[modelName in keyof TModels]: {
		[effectName in keyof ExtractRematchDispatchersFromEffects<
			TModels[modelName]['effects'],
			TModels
		>]: T
	}
}

interface UpdatedModel<TModels extends Models<TModels>, T = Date>
	extends Model<TModels, UpdatedState<TModels, T>> {
	reducers: {
		onUpdate(
			state: UpdatedState<TModels, T>,
			payload: { name: string; action: string }
		): UpdatedState<TModels, T>
	}
}

export interface ExtraModelsFromUpdated<
	TModels extends Models<TModels>,
	T = Date
> extends Models<TModels> {
	updated: UpdatedModel<TModels, T>
}

const updatedPlugin = <
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels> = Record<string, any>,
	T = Date
>(
	config: UpdatedConfig<T> = {}
): Plugin<TModels, TExtraModels, ExtraModelsFromUpdated<TModels, T>> => {
	const updatedModelName = config.name || 'updated'
	const updated = {
		name: updatedModelName,
		state: {} as Record<string, any>,
		reducers: {
			onUpdate: (
				state: UpdatedState<TModels, T>,
				payload: { name: string; action: string }
			): UpdatedState<TModels, T> => ({
				...state,
				[payload.name]: {
					...state[payload.name],
					[payload.action]: config.dateCreator
						? config.dateCreator()
						: new Date(),
				},
			}),
		},
	}

	const avoidModels = [...(config.blacklist || []), updatedModelName]

	return {
		config: {
			models: {
				updated: updated as UpdatedModel<TModels, T>,
			},
		},
		onModel({ name }, rematch): void {
			// do not run dispatch on updated model and blacklisted models
			if (avoidModels.includes(name)) {
				return
			}

			const modelActions = rematch.dispatch[name]

			// add empty object for effects
			updated.state[name] = {}

			// map over effects within models
			for (const action of Object.keys(modelActions)) {
				if (rematch.dispatch[name][action].isEffect) {
					// copy function
					const originalDispatcher = rematch.dispatch[name][action]

					// replace existing effect with new dispatch
					rematch.dispatch[name][action] = (...props: any): any => {
						const effectResult = originalDispatcher(...props)
						// check if result is a promise
						if (effectResult?.then) {
							effectResult.then((result: any) => {
								// set updated when promise finishes
								rematch.dispatch[updatedModelName].onUpdate({ name, action })
								return result
							})
						} else {
							// no need to wait for the result, as it's not a promise
							rematch.dispatch[updatedModelName].onUpdate({ name, action })
						}

						return effectResult
					}
				}
			}
		},
	}
}

export default updatedPlugin
