import { ExtractRematchSelectorsFromModels, Store, Model, Models, Plugin } from '@rematch/core'

export const select = {}

const stores = []
const localSelects = []

const mapStateToStore = (state: any) =>
	stores.findIndex((store) => store.getState() === state)

export function withSelect(mapSelectToProps: Function) {
	return (state, ...args) =>
		mapSelectToProps(
			localSelects[mapStateToStore(state)],
			...args
		)
}

export function getSelect<M extends Models = Models>() {
	return select as ExtractRematchSelectorsFromModels<M>
}

export interface SelectConfig {
	sliceState?: any,
}

const validateConfig = (config) => {
  if (config.sliceState && typeof config.sliceState !== 'function') {
    throw new Error('select plugin config sliceState must be a function')
  }
}

const createSelectPlugin = (config: SelectConfig = {}): Plugin => {
  validateConfig(config)

  const sliceState = config.sliceState || ((rootState, model) => rootState[model.name])

	const localSelect = {}

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
				    localSelects[mapStateToStore(state)][model.name],
				    sliceState(state, model),
				    ...args
				  )
			})
    },
		onStoreCreated(store: Store) {
			stores.push(store)
			localSelects.push(localSelect)
		}
  }
}

export default createSelectPlugin
