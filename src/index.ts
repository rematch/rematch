import { Config } from '../typings/rematch'
import Rematch from './rematch'

// allows for global dispatch to multiple stores
const stores = []

export const init = (config: Config) => new Rematch(config).init()

export const globalDispatch = (action) => {
  return stores.forEach((store) => store.dispatch(action))
}

// export const globalGetState = () => ({
//   // TODO
// })

export default {
  dispatch: globalDispatch,
  // getState: globalGetState,
  init,
}
