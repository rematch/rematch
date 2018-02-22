import init from './init'
import { createModel as model } from './model'
import dispatchPlugin from './plugins/dispatch'
import { store } from './redux/store'

const { expose: { dispatch } } = dispatchPlugin

const getState = () => store.getState()

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
