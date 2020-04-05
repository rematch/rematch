/* eslint-disable @typescript-eslint/ban-ts-ignore */
import {
	Action,
	EffectAction,
	ExtractRematchDispatchersFromModel,
	ModelEffects,
	ModelEffectsCreator,
	Models,
	NamedModel,
	RematchBag,
	RematchDispatcher,
	EffectRematchDispatcher,
	RematchRootState,
	RematchStore,
} from './types'
import { validateModelEffect, validateModelReducer } from './validate'

/**
 * Returns a function which dispatches action based on the model and actionName.
 */
const createActionDispatcher = <M extends Models>(
	rematch: RematchStore<M>,
	modelName: string,
	actionName: string
): RematchDispatcher => {
	return (payload?: any): Action => {
		const action: Action = { type: `${modelName}/${actionName}` }

		if (typeof payload !== 'undefined') {
			action.payload = payload
		}

		return rematch.dispatch(action)
	}
}

/**
 * Returns the intersection of action dispatcher and isEffect property.
 * isEffect is a tag on effects so they can be differentiated from regular
 * dispatchers.
 */
const createEffectActionDispatcher = <M extends Models>(
	rematch: RematchStore<M>,
	modelName: string,
	actionName: string
): EffectRematchDispatcher => {
	return Object.assign(
		(payload?: any): EffectAction => {
			const action: EffectAction = {
				type: `${modelName}/${actionName}`,
				result: undefined,
			}

			if (typeof payload !== 'undefined') {
				action.payload = payload
			}

			return rematch.dispatch(action)
		},
		{
			isEffect: true as true,
		}
	)
}

/**
 * Creates a dispatcher object for a model - it contains a mapping from all
 * reducers and effects *names* to functions which dispatch their corresponding
 * actions.
 */
const createDispatcher = <AllModels extends Models, M extends NamedModel>(
	rematch: RematchStore<AllModels>,
	bag: RematchBag<AllModels>,
	model: M
): ExtractRematchDispatchersFromModel<M> => {
	const dispatcher = {} as ExtractRematchDispatchersFromModel<M>

	// map reducer names to dispatch actions
	for (const reducerName of Object.keys(model.reducers)) {
		validateModelReducer(model.name, model.reducers, reducerName)

		// @ts-ignore
		dispatcher[reducerName] = createActionDispatcher(
			rematch,
			model.name,
			reducerName
		)
	}

	let effects: ModelEffects<RematchRootState<AllModels>> = {}

	// 'effects' might be actually a function creating effects
	if (model.effects) {
		effects =
			typeof model.effects === 'function'
				? (model.effects as ModelEffectsCreator<any>)(rematch.dispatch)
				: model.effects
	}

	// map effects names to dispatch actions
	for (const effectName of Object.keys(effects)) {
		validateModelEffect(model.name, effects, effectName)

		bag.effects[`${model.name}/${effectName}`] = effects[effectName].bind(
			dispatcher
		)

		// @ts-ignore
		dispatcher[effectName] = createEffectActionDispatcher(
			rematch,
			model.name,
			effectName
		)
	}

	return dispatcher
}

export default createDispatcher
