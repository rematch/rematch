import { Action, Model, PluginCreator } from '@rematch/core'

interface LoadingConfig {
  name?: string,
  whitelist?: string[],
  blacklist?: string[],
  asNumber ?: boolean,
  model?: any,
  mergeInitialState?: any,
  loadingActionCreator?: any,
}

const cntState = {
  global: 0,
  models: {},
  effects: {},
}

const defaultLoadingActionCreator = (state, name, action, converter, countState) => ({
  ...state,
  global: converter(countState.global),
  models: {
    ...state.models,
    [name]: converter(countState.models[name]),
  },
  effects: {
    ...state.effects,
    [name]: {
      ...state.effects[name],
      [action]: converter(countState.effects[name][action]),
    },
  },
})

const defaultMergeInitialState = (state, newObject: any = {}) => (Object.assign(state, {
  ...newObject,
  models: Object.assign(state.models, {...newObject.models}),
  effects: Object.assign(state.effects, {...newObject.effects}),
}))

const createLoadingAction = (converter, i, loadingActionCreator) => (state, { name, action }: any ) => {
  cntState.global += i
  cntState.models[name] += i
  cntState.effects[name][action] += i

  return loadingActionCreator(state, name, action, converter, cntState)
}

const validateConfig = config => {
  if (config.name && typeof config.name !== 'string') {
    throw new Error('loading plugin config name must be a string')
  }
  if (config.model && config.model.name && typeof config.model.name !== 'string') {
    throw new Error('loading plugin config model.name must be a string')
  }
  if (config.asNumber && typeof config.asNumber !== 'boolean') {
    throw new Error('loading plugin config asNumber must be a boolean')
  }
  if (config.whitelist && !Array.isArray(config.whitelist)) {
    throw new Error('loading plugin config whitelist must be an array of strings')
  }
  if (config.blacklist && !Array.isArray(config.blacklist)) {
    throw new Error('loading plugin config blacklist must be an array of strings')
  }
  if (config.whitelist && config.blacklist) {
    throw new Error('loading plugin config cannot have both a whitelist & a blacklist')
  }
  if (typeof config.loadingActionCreator !== 'function') {
    throw new Error('loading plugin config loadingActionCreator must be a function')
  }
  if (typeof config.mergeInitialState !== 'function') {
    throw new Error('loading plugin config mergeInitialState must be a function')
  }
  if (typeof config.model !== 'object') {
    throw new Error('loading plugin config model must be an object')
  }
}

export default (config: LoadingConfig = {}): any => {

  if (!config.loadingActionCreator)
    config.loadingActionCreator = defaultLoadingActionCreator

  if (!config.mergeInitialState)
    config.mergeInitialState = defaultMergeInitialState;

  if (!config.model)
    config.model = {}

  validateConfig(config)

  const loadingModelName = config.name || config.model.name || 'loading'

  const converter =
    config.asNumber === true
      ? cnt => cnt
      : cnt => cnt > 0

  let { reducers, ...modelConfig } = config.model;

  const loading: Model = {
    reducers: {
      ...reducers,
      hide: createLoadingAction(converter, -1, config.loadingActionCreator),
      show: createLoadingAction(converter, 1, config.loadingActionCreator),
    },
    state: { ...cntState },
    ...modelConfig,
    name: loadingModelName,
  }

  cntState.global = 0
  loading.state = config.mergeInitialState(
    loading.state, { ...cntState, global: converter(cntState.global) }
  )

  return {
    config: {
      models: {
        loading,
      },
    },
    init: ({ dispatch }) => ({
      onModel({ name }: Model) {
        // do not run dispatch on "loading" model
        if (name === loadingModelName) { return }

        cntState.models[name] = 0
        cntState.effects[name] = {}

        let localLoadingState: any = {
          models: { [name]: converter(cntState.models[name]) },
          effects: { [name]: {} }
        }
        config.mergeInitialState(loading.state, localLoadingState)

        const modelActions = dispatch[name]

        // map over effects within models
        Object.keys(modelActions).forEach((action: string) => {
          if (dispatch[name][action].isEffect !== true) {
            return
          }

          cntState.effects[name][action] = 0

          localLoadingState = {
            effects: {
              ...localLoadingState.effects,
              [name]: {
                ...localLoadingState.effects[name],
                [action]: converter(cntState.effects[name][action])
              }
            }
          }

          const actionType = `${name}/${action}`

          // ignore items not in whitelist
          if (config.whitelist && !config.whitelist.includes(actionType)) {
            return
          }

          // ignore items in blacklist
          if (config.blacklist && config.blacklist.includes(actionType)) {
            return
          }

          // copy orig effect pointer
          const origEffect = dispatch[name][action]

          // create function with pre & post loading calls
          const effectWrapper = async (...props) => {
            try {
              dispatch.loading.show({ name, action })
              await origEffect(...props)
              // waits for dispatch function to finish before calling "hide"
            } finally {
              dispatch.loading.hide({ name, action })
            }
          }

          // replace existing effect with new wrapper
          dispatch[name][action] = effectWrapper
        })
        config.mergeInitialState(loading.state, localLoadingState)
      },
    }),
  }
}