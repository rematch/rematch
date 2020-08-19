/* eslint-disable @typescript-eslint/ban-ts-ignore */
import {
	ExtractRematchDispatchersFromEffects,
	Models,
	NamedModel,
	Plugin,
	RematchStore,
} from '@rematch/core'

export interface UpdatedConfig<T = Date> {
	name?: string
	blacklist?: string[]
	dateCreator?(): T
}

export type UpdatedState<M extends Models, T> = {
	[modelName in keyof M]: {
		[effectName in keyof ExtractRematchDispatchersFromEffects<
			M[modelName]['effects'],
			M
		>]: T
	}
}

const updatedPlugin = <M extends Models = Models, T = Date>(
	config: UpdatedConfig<T> = {}
): Plugin => {
	const updatedModelName = config.name || 'updated'
	const updated = {
		name: updatedModelName,
		state: {} as UpdatedState<M, T>,
		reducers: {
			onUpdate: (
				state: UpdatedState<M, T>,
				payload: { name: string; action: string }
			): UpdatedState<M, T> => ({
				...state,
				[payload.name]: {
					// @ts-ignore
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
				updated,
			},
		},
		onModel({ name }: NamedModel, rematch: RematchStore<any>): void {
			// do not run dispatch on updated model and blacklisted models
			if (avoidModels.includes(name)) {
				return
			}

			const modelActions = rematch.dispatch[name]

			// add empty object for effects
			// @ts-ignore
			updated.state[name] = {}

			// map over effects within models
			for (const action of Object.keys(modelActions)) {
				// @ts-ignore
				if (rematch.dispatch[name][action].isEffect) {
					// copy function
					// @ts-ignore
					const originalDispatcher = rematch.dispatch[name][action]

					// replace existing effect with new dispatch
					// @ts-ignore
					rematch.dispatch[name][action] = (...props: any): any => {
						// @ts-ignore
						const effectResult = originalDispatcher(...props)
						// check if result is a promise
						if (effectResult?.then) {
							effectResult.then((result: any) => {
								// set updated when promise finishes
								// @ts-ignore
								rematch.dispatch[updatedModelName].onUpdate({ name, action })
								return result
							})
						} else {
							// no need to wait for the result, as it's not a promise
							// @ts-ignore
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
