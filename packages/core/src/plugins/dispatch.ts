/* eslint-disable @typescript-eslint/no-non-null-assertion,no-console,@typescript-eslint/ban-ts-ignore,class-methods-use-this */
import * as R from '../typings'

/**
 * Dispatch Plugin
 *
 * generates dispatch[modelName][actionName]
 */

const dispatchPlugin: R.Plugin = {
  exposed: {
    // required as a placeholder for store.dispatch
    storeDispatch(): void {
      console.warn('Warning: store not yet loaded')
    },

    storeGetState(): void {
      console.warn('Warning: store not yet loaded')
    },

    /**
     * dispatch
     *
     * both a function (dispatch) and an object (dispatch[modelName][actionName])
     * @param rematch Rematch
     * @param action R.Action
     */
    dispatch(rematch: R.Rematch, action: R.Action): R.Action {
      return rematch.storeDispatch!(action)
    },

    /**
     * createDispatcher
     *
     * generates an action creator for a given model & reducer
     * @param rematch Rematch
     * @param modelName string
     * @param reducerName string
     */
    createDispatcher(
      rematch: R.Rematch,
      modelName: string,
      reducerName: string
    ) {
      return (payload?, meta?): R.Action | Promise<R.Action> => {
        const action: R.Action = { type: `${modelName}/${reducerName}` }

        if (typeof payload !== 'undefined') {
          action.payload = payload
        }

        if (typeof meta !== 'undefined') {
          action.meta = meta
        }

        return rematch.dispatch!(action)
      }
    },
  },

  // access store.dispatch after store is created
  onStoreCreated(store: R.RematchStore, rematch: R.Rematch): void {
    rematch.storeDispatch = store.dispatch
    rematch.storeGetState = store.getState
    store.dispatch = rematch.dispatch!
  },

  // generate action creators for all model.reducers
  onModel(model: R.NamedModel, rematch: R.Rematch) {
    rematch.dispatch![model.name] = {}

    if (!model.reducers) {
      return
    }

    for (const reducerName of Object.keys(model.reducers)) {
      rematch.validate([
        [
          !!reducerName.match(/\/.+\//),
          `Invalid reducer name (${model.name}/${reducerName})`,
        ],
        [
          typeof model.reducers[reducerName] !== 'function',
          `Invalid reducer (${model.name}/${reducerName}). Must be a function`,
        ],
      ])

      // @ts-ignore
      rematch.dispatch[model.name][reducerName] = rematch.createDispatcher!(
        model.name,
        reducerName
      )
    }
  },
}

export default dispatchPlugin
