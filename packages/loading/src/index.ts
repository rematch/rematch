/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/ban-ts-ignore */
import {
  ExtractRematchDispatchersFromEffects,
  NamedModel,
  Plugin,
  Models,
  Rematch,
} from '@rematch/core'

export interface LoadingConfig {
  name?: string
  whitelist?: string[]
  blacklist?: string[]
  asNumber?: boolean
}

export interface LoadingState<M extends Models> {
  loading: {
    global: boolean
    models: { [modelName in keyof M]: boolean }
    effects: {
      [modelName in keyof M]: {
        [effectName in keyof ExtractRematchDispatchersFromEffects<
          M[modelName]['effects']
        >]: boolean
      }
    }
  }
}

const createLoadingAction = (converter, i, cntState) => (
  state,
  { name, action }: any
) => {
  cntState.global += i
  cntState.models[name] += i
  cntState.effects[name][action] += i

  return {
    ...state,
    global: converter(cntState.global),
    models: {
      ...state.models,
      [name]: converter(cntState.models[name]),
    },
    effects: {
      ...state.effects,
      [name]: {
        ...state.effects[name],
        [action]: converter(cntState.effects[name][action]),
      },
    },
  }
}

const validateConfig = config => {
  if (config.name && typeof config.name !== 'string') {
    throw new Error('loading plugin config name must be a string')
  }
  if (config.asNumber && typeof config.asNumber !== 'boolean') {
    throw new Error('loading plugin config asNumber must be a boolean')
  }
  if (config.whitelist && !Array.isArray(config.whitelist)) {
    throw new Error(
      'loading plugin config whitelist must be an array of strings'
    )
  }
  if (config.blacklist && !Array.isArray(config.blacklist)) {
    throw new Error(
      'loading plugin config blacklist must be an array of strings'
    )
  }
  if (config.whitelist && config.blacklist) {
    throw new Error(
      'loading plugin config cannot have both a whitelist & a blacklist'
    )
  }
}

export default (config: LoadingConfig = {}): Plugin => {
  validateConfig(config)

  const cntState = {
    global: 0,
    models: {},
    effects: {},
  }

  const loadingInitialState = {
    global: 0,
    models: {},
    effects: {},
  }

  const loadingModelName = config.name || 'loading'

  const converter =
    config.asNumber === true ? (cnt: number) => cnt : (cnt: number) => cnt > 0

  const loading: NamedModel = {
    name: loadingModelName,
    reducers: {
      hide: createLoadingAction(converter, -1, cntState),
      show: createLoadingAction(converter, 1, cntState),
    },
    state: loadingInitialState,
  }

  const initialLoadingValue = converter(0)

  // @ts-ignore
  loadingInitialState.global = initialLoadingValue

  return {
    config: {
      models: {
        loading,
      },
    },
    onModel({ name }: NamedModel, rematch: Rematch) {
      // do not run dispatch on "loading" model
      if (name === loadingModelName) {
        return
      }

      cntState.models[name] = 0
      cntState.effects[name] = {}

      loadingInitialState.models[name] = initialLoadingValue
      loadingInitialState.effects[name] = {}

      const modelActions = rematch.dispatch![name]

      // map over effects within models
      Object.keys(modelActions).forEach((action: string) => {
        // @ts-ignore
        if (rematch.dispatch![name][action].isEffect !== true) {
          return
        }

        cntState.effects[name][action] = 0
        loadingInitialState.effects[name][action] = initialLoadingValue

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
        const origEffect = rematch.dispatch![name][action]

        // create function with pre & post loading calls
        const effectWrapper = async (...props) => {
          try {
            rematch.dispatch!.loading.show({ name, action })
            // waits for dispatch function to finish before calling "hide"
            const effectResult = await origEffect(...props)
            rematch.dispatch!.loading.hide({ name, action })
            return effectResult
          } catch (error) {
            rematch.dispatch!.loading.hide({ name, action })
            throw error
          }
        }

        effectWrapper.isEffect = true

        // replace existing effect with new wrapper
        // @ts-ignore
        rematch.dispatch[name][action] = effectWrapper
      })
    },
  }
}
