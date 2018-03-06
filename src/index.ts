import init from './init'
import { createModel as model } from './model'
import dispatchPlugin from './plugins/dispatch'
import { store } from './redux/store'
import deprecate from './utils/deprecate'

const { expose: { dispatch } } = dispatchPlugin

const getState = () => {
  deprecate('getState import will be removed in @rematch/core@v1.0.0')
  return store.getState()
}

export default {
  dispatch,
  getState,
  init,
  model,
}

export {
  dispatch,
  getState,
  init,
  model,
}
