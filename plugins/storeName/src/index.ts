import { Store, Plugin } from '@rematch/core'

export const STORE_NAME_KEY = '@@rematchStoreName'

export interface StoreNameConfig {
  key?: string,
}

const storeNamePlugin = (config: StoreNameConfig = {}): Plugin => {
  const key = config.key || STORE_NAME_KEY

  return {
    exposed: {
      storeName: { key }
    },
    onInit() {
      this.validate([
        [
          typeof name !== 'string',
          'getters plugin config key must be a string'
        ]
      ])
    },
    onStoreCreated(store: Store) {
      store.model({ name: key, state: store.name })
    }
  }
}

export default storeNamePlugin
