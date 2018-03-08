import Rematch from './rematch'

// allows for global dispatch to multiple stores
const stores = []

export const init = (config) => new Rematch(config).init()

export const dispatch = (action, payload, meta) =>
    stores.forEach((store) =>
      store.dispatch(action, payload, meta))

export default {
  dispatch,
  init,
}
