import * as R from '../typings.d'

/**
 * Dispatch Plugin
 *
 * generates dispatch[modelName][actionName]
 */
const dispatchPlugin: R.Plugin = {
	exposed: {
		// required as a placeholder for store.dispatch
		storeDispatch(action: R.Action, state: any) {
			console.warn('Warning: store not yet loaded')
		},

		storeGetState() {
			console.warn('Warning: store not yet loaded')
		},

		/**
		 * dispatch
		 *
		 * both a function (dispatch) and an object (dispatch[modelName][actionName])
		 * @param action R.Action
		 */
		dispatch(action: R.Action) {
			return this.storeDispatch(action)
		},

		/**
		 * createDispatcher
		 *
		 * genereates an action creator for a given model & reducer
		 * @param modelName string
		 * @param reducerName string
		 */
		createDispatcher(modelName: string, reducerName: string) {
			return async (payload?: any, meta?: any): Promise<any> => {
				const action: R.Action = { type: `${modelName}/${reducerName}` }
				if (typeof payload !== 'undefined') {
					action.payload = payload
				}
				if (typeof meta !== 'undefined') {
					action.meta = meta
				}
				if (this.dispatch[modelName][reducerName].isEffect) {
					// ensure that effect state is captured on dispatch
					// to avoid possible mutations and warnings
					return this.dispatch(action)
				}
				return this.dispatch(action)
			}
		},
	},

	// access store.dispatch after store is created
	onStoreCreated(store: any) {
		this.storeDispatch = store.dispatch
		this.storeGetState = store.getState
		return { dispatch: this.dispatch }
	},

	// generate action creators for all model.reducers
	onModel(model: R.Model) {
		this.dispatch[model.name] = {}
		if (!model.reducers) {
			return
		}
		for (const reducerName of Object.keys(model.reducers)) {
			this.validate([
				[
					!!reducerName.match(/\/.+\//),
					`Invalid reducer name (${model.name}/${reducerName})`,
				],
				[
					typeof model.reducers[reducerName] !== 'function',
					`Invalid reducer (${model.name}/${reducerName}). Must be a function`,
				],
			])
			this.dispatch[model.name][reducerName] = this.createDispatcher.apply(
				this,
				[model.name, reducerName]
			)
		}
	},
}

export default dispatchPlugin
