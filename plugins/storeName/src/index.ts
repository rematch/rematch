import { Store, Plugin } from '@rematch/core'

export const STORE_NAME_KEY = '@@rematchStoreName'

export interface ExposeStoreNameConfig {
  name?: string,
}

const exposeStoreNamePlugin = (config: ExposeStoreNameConfig = {}): Plugin => {
  // model
  const name = config.name || STORE_NAME_KEY

  return {
    onInit() {
      this.validate([
        [
          typeof name !== 'string',
          'getters plugin config name must be a string'
        ]
      ])
    },
    onStoreCreated(store: Store) {
      store.model({ name, state: store.name })
    }
  }
}

export default exposeStoreNamePlugin
