// @flow
import { dispatch } from './dispatch'

export const effects = {}

// TODO assumes there is a dispatch plugin
export default (storeDispatch: $dispatch) => ({
  onModel(model: $model) {
    const createDispatcher = (modelName: string, reducerName: string) => (payload: any) => {
      const action = {
        type: `${modelName}/${reducerName}`,
        ...(payload ? { payload } : {})
      }
      storeDispatch(action)
    }

    Object.keys(model.effects || {}).forEach((effectName: string) => {
      effects[`${model.name}/${effectName}`] = model.effects[effectName].bind(
        dispatch[model.name]
      )
      // add effect to dispatch
      // is assuming dispatch is available already... that the dispatch plugin is in there
      dispatch[model.name][effectName] = createDispatcher(model.name, effectName)
    })
  },
  middleware: (store: $store) => (next: (action: $action) => any) => async (action: $action) => {
    // async/await acts as promise middleware
    let result
    if (action.type in effects) {
      result = await effects[action.type](action.payload, store.getState)
    } else {
      result = await next(action)
    }
    return result
  }
})
