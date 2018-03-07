import Rematch from './rematch'

// allows for global dispatch to multiple stores
const dispatchInstances = []

export const init = (config) => new Rematch(config)

export const dispatch = (action, payload, meta) =>
    dispatchInstances.forEach((dispatchInstance) =>
      dispatchInstance(action, payload, meta))

export default {
  dispatch,
  init,
}
