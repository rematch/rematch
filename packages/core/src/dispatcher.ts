/* eslint-disable @typescript-eslint/ban-ts-ignore */
import {
	Action,
	ModelDispatcher,
	ModelEffects,
	ModelEffectsCreator,
	Models,
	NamedModel,
	RematchBag,
	RematchDispatcher,
	EffectRematchDispatcher,
	RematchStore,
} from './types'
import { validateModelEffect, validateModelReducer } from './validate'

/**
 * Builds a dispatcher for given model name and action name. The dispatched
 * action will have a type `modelName/actionName`.
 * Additionally, adds the isEffect property to the created dispatcher.
 * isEffect helps to differentiate effects dispatchers from reducer dispatchers.
 */
const createActionDispatcher = <TModels extends Models>(
	rematch: RematchStore<TModels>,
	modelName: string,
	actionName: string,
	isEffect: boolean
): RematchDispatcher | EffectRematchDispatcher => {
	return Object.assign(
		(payload?: any): Action => {
			const action: Action = { type: `${modelName}/${actionName}` }

			if (typeof payload !== 'undefined') {
				action.payload = payload
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
 * reducers and effects *names* to functions which dispatch their corresponding
 * actions.
 */
const createDispatcher = <TModels extends Models, TModel extends NamedModel>(
	rematch: RematchStore<TModels>,
	bag: RematchBag,
	model: TModel
): ModelDispatcher<TModel, TModels> => {
	const modelDispatcher = {} as ModelDispatcher<TModel, TModels>

	// map reducer names to dispatch actions
	for (const reducerName of Object.keys(model.reducers)) {
		validateModelReducer(model.name, model.reducers, reducerName)

		// @ts-ignore
		modelDispatcher[reducerName] = createActionDispatcher(
			rematch,
			model.name,
			reducerName,
			false
		)
	}

	let effects: ModelEffects = {}

	// 'effects' might be actually a function creating effects
	if (model.effects) {
		effects =
			typeof model.effects === 'function'
				? (model.effects as ModelEffectsCreator<TModels>)(rematch.dispatch)
				: model.effects
	}

	// map effects names to dispatch actions
	for (const effectName of Object.keys(effects)) {
		validateModelEffect(model.name, effects, effectName)

		// @ts-ignore
		bag.effects[`${model.name}/${effectName}`] = effects[effectName].bind(
			// @ts-ignore
			modelDispatcher
		)

		// @ts-ignore
		modelDispatcher[effectName] = createActionDispatcher(
			rematch,
			model.name,
			effectName,
			true
		)
	}

	return modelDispatcher
}

export default createDispatcher
