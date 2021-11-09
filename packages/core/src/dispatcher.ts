import {
	Action,
	ModelEffects,
	ModelEffectsCreator,
	Models,
	NamedModel,
	RematchBag,
	RematchDispatcher,
	RematchStore,
} from './types'
import { validateModelEffect, validateModelReducer } from './validate'

/**
 * Builds a dispatcher for given model name and action name. The dispatched
 * action will have a type `modelName/actionName`.
 * Additionally, adds the isEffect property to the created dispatcher.
 * isEffect helps to differentiate effects dispatchers from reducer dispatchers.
 */
const createActionDispatcher = <
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>
>(
	rematch: RematchStore<TModels, TExtraModels>,
	modelName: string,
	actionName: string,
	isEffect: boolean
): RematchDispatcher<boolean> => {
	return Object.assign(
		(payload?: any, meta?: any): Action => {
			const action: Action = { type: `${modelName}/${actionName}` }

			if (typeof payload !== 'undefined') {
				action.payload = payload
			}

			if (typeof meta !== 'undefined') {
				action.meta = meta
			}

			return rematch.dispatch(action)
		},
		{
			isEffect,
		}
	)
}

/**
 * Creates a dispatcher object for a model - it contains a mapping from all
 * reducers to functions which dispatch their corresponding actions.
 */
export const createReducerDispatcher = <
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>,
	TModel extends NamedModel<TModels>
>(
	rematch: RematchStore<TModels, TExtraModels>,
	model: TModel
): void => {
	const modelDispatcher = rematch.dispatch[model.name]

	// map reducer names to dispatch actions
	const modelReducersKeys = Object.keys(model.reducers)
	modelReducersKeys.forEach((reducerName) => {
		validateModelReducer(model.name, model.reducers, reducerName)

		modelDispatcher[reducerName] = createActionDispatcher(
			rematch,
			model.name,
			reducerName,
			false
		)
	})
}

/**
 * Creates effects dispatcher for a model - it contains a mapping from all
 * effects *names* to functions which dispatch their corresponding actions.
 */
export const createEffectDispatcher = <
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>,
	TModel extends NamedModel<TModels>
>(
	rematch: RematchStore<TModels, TExtraModels>,
	bag: RematchBag<TModels, TExtraModels>,
	model: TModel
): void => {
	const modelDispatcher = rematch.dispatch[model.name]
	let effects: ModelEffects<TModels> = {}

	// 'effects' might be actually a function creating effects
	if (model.effects) {
		effects =
			typeof model.effects === 'function'
				? (model.effects as ModelEffectsCreator<TModels>)(rematch.dispatch)
				: model.effects
	}

	// map effects names to dispatch actions
	const effectKeys = Object.keys(effects)
	effectKeys.forEach((effectName) => {
		validateModelEffect(model.name, effects, effectName)

		bag.effects[`${model.name}/${effectName}`] =
			effects[effectName].bind(modelDispatcher)

		modelDispatcher[effectName] = createActionDispatcher(
			rematch,
			model.name,
			effectName,
			true
		)
	})
}
