import { PluginCreator, RootReducers, Models } from '@rematch/core'
import { combineReducers } from 'redux'
import produce from 'immer'

function combineReducersWithImmer(reducers: RootReducers) {
  const reducersWithImmer = {}

  // reducer must return value because literal don't support immer
  Object.entries(reducers).forEach(([key, reducerFn]) => {
    reducersWithImmer[key] = (state, payload) => {
      if (typeof state === 'object') {
        return produce(state, (draft: Models) => {
          reducerFn(draft, payload)
        })
      } else {
        return reducerFn(state, payload)
      }
    }
  })

  return combineReducers(reducersWithImmer)
}

// rematch plugin
export default (): PluginCreator => {
  return {
    config: {
      redux: {
        combineReducers: combineReducersWithImmer,
      },
    },
  }
}