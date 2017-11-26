import init from './init'
import { createModel as model } from './model'
import { getStore } from './redux/store'
import dispatchPlugin from './plugins/dispatch'

const { expose: { dispatch } } = dispatchPlugin

export default {
  init,
  model,
  getStore,
  dispatch,
}

export {
  init,
  model,
  getStore,
  dispatch,
}
