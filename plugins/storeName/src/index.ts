import { Store, Plugin } from '@rematch/core'

export const STORE_NAME_KEY = '@@rematchStoreName'

export interface StoreNameConfig {
  name?: string,
}

const storeNamePlugin = (config: StoreNameConfig = {}): Plugin => {
  // model
  const name = config.name || STORE_NAME_KEY

  return {
    exposed: {
      storeName: { key: name }
    },
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

export default storeNamePlugin
