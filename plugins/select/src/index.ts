import { ExtractRematchSelectorsFromModels, Model, Models, Plugin } from '@rematch/core'

export const select = {}

export function getSelect<M extends Models = Models>() {
	return select as ExtractRematchSelectorsFromModels<M>
}

export interface SelectConfig {
  name?: string,
	sliceState?: any,
}

const validateConfig = (config) => {
  if (config.name && typeof config.name !== 'string') {
    throw new Error('select plugin config name must be a string')
  }
  if (config.sliceState && typeof config.sliceState !== 'function') {
    throw new Error('select plugin config sliceState must be a function')
  }
}

const createSelectPlugin = (config: SelectConfig = {}): Plugin => {
  validateConfig(config)

  const sliceState = config.sliceState || ((rootState, model) => rootState[model.name])

  const selectModelName = config.name || 'select'

  const selectModel: Model = {
    state: {},
    name: selectModelName,
  }

  return {
    config: {
      models: {
        selectModel,
      },
    },
    onModel(model: Model) {
      if (model.name === selectModelName) { return }

      select[model.name] = {}
      selectModel.state[model.name] = {}

      const selectors =
        typeof model.selectors === "function"
          ? model.selectors(selectModel.state)
          : model.selectors

      Object.keys(selectors || {}).forEach((selectorName: String) => {
        this.validate([
          [
            typeof selectors[selectorName] !== "function",
            `Selector (${model.name}/${selectorName}) must be a function`
          ]
        ])


        select[model.name][selectorName] = (state: any, ...args) =>
          selectors[selectorName].call(
            state[selectModelName][model.name],
            sliceState(state, model),
            ...args
          )


        selectModel.state[model.name][selectorName] = (...args) =>
          selectors[selectorName].call(
            selectModel.state[model.name],
            sliceState(this.storeGetState(), model),
            ...args
          )
      })
    }
  }
}

export default createSelectPlugin
