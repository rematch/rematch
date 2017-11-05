import init from './init'
import { createModel as model } from './model'
import { getStore } from './redux/store'

import dispatchPlugin from './plugins/dispatch'
import selectPlugin from './plugins/selectors'

const { expose: { dispatch } } = dispatchPlugin
const { expose: { select } } = selectPlugin

export default {
  init,
  model,
  getStore,
  dispatch,
  select,
}

export {
  init,
  model,
  getStore,
  dispatch,
  select
}
