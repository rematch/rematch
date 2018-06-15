import { ExtractRematchSelectorsFromModels, Store, Model, Models, Plugin } from '@rematch/core'

export const SELECT_REF_KEY = '@@selectRef'

export const select = {}
const localSelects = {}

export function withSelect(mapSelectToProps: Function, name = SELECT_REF_KEY) {
	return (state, ...args) =>
		mapSelectToProps(
			localSelects[state[name]],
			...args
		)
}

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

	const localSelect = {}

	const refKey = config.name || SELECT_REF_KEY

  return {
    onModel(model: Model) {

      select[model.name] = {}
			localSelect[model.name] = {}

      const selectors =
        typeof model.selectors === "function"
          ? model.selectors(localSelect)
          : model.selectors

     	Object.keys(selectors || {}).forEach((selectorName: String) => {
				this.validate([
				  [
				    typeof selectors[selectorName] !== "function",
				    `Selector (${model.name}/${selectorName}) must be a function`
				  ]
				])

				localSelect[model.name][selectorName] = (...args) =>
					selectors[selectorName].call(
						localSelect[model.name],
						sliceState(this.storeGetState(), model),
						...args
					)

				select[model.name][selectorName] = (state: any, ...args) =>
				  selectors[selectorName].call(
				    localSelects[state[refKey]][model.name],
				    sliceState(state, model),
				    ...args
				  )
			})
    },
		onStoreCreated(store: Store) {
			const ref = store.name || 'fixme'
			localSelects[ref] = localSelect
			store.model({
				name: refKey,
				state: ref
			})
		}
  }
}

export default createSelectPlugin
