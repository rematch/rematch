import init from './init'
import { createModel as model } from './model'
import dispatchPlugin from './plugins/dispatch'

const { expose: { dispatch } } = dispatchPlugin

export {
  dispatch,
  init,
  model,
}
