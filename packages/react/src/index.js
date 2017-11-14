import React from 'react'
import { connect, Provider } from 'react-redux'

let dispatch = null
let select = null
let getStore = null

const init = Rematch => {
  dispatch = Rematch.dispatch
  select = Rematch.select
  getStore = Rematch.getStore
}

const getModelSelectors = (state, modelName) => {
  const modelSelectors = {}
  Object.keys(select[modelName] || {}).forEach(selectorName => {
    modelSelectors[selectorName] = (...args) => select[modelName][selectorName](state, ...args)
  })
  return modelSelectors
}

const connectRematch = (modelNames, mapToProps) => Component => {
  const processModels = state => {
    const models = {}
    modelNames.forEach(name => {
      models[name] = {
        name,
        state: state[name],
        dispatch: dispatch[name],
        select: getModelSelectors(state, name)
      }
    })
    return models
  }
  return connect(state => mapToProps(processModels(state)))(Component)
}

const RematchReactProvider = props => (
  <Provider store={getStore()}>
    {props.children}
  </Provider>
)

export default {
  init,
  Provider: RematchReactProvider,
  connect: connectRematch
}

export {
  init,
  RematchReactProvider as Provider,
  connectRematch as connect
}

