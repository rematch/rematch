import Rematch from './rematch'

// allows for global dispatch to multiple stores
const stores = []

export const init = (config: Config<S>) => new Rematch(config).init()

export const dispatch = (action) =>
    stores.forEach((store) =>
      store.dispatch(action))

export default {
  dispatch,
  init,
}
