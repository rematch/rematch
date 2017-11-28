import init from './init'
import { createModel as model } from './model'
import dispatchPlugin from './plugins/dispatch'
import { getStore } from './redux/store'

const { expose: { dispatch } } = dispatchPlugin

export default {
  dispatch,
  getStore,
  init,
  model,
}

export {
  dispatch,
  getStore,
  init,
  model,
}
